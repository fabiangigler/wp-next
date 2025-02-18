import{l as u,j as y,b as m,r as c,t as h}from"./config-b1afd602.js";function _(e){const n={};for(let t=e.length-1;t>=0;t--){for(let a=t-1;a>=0;a--){const s=f(e[t],e[a]);if(s==="none")continue;const r=e[t],i=e[a];if(r.operation==="RENAME"&&i.operation==="RENAME"){u.warn("[FS Journal] Normalizing a double rename is not yet supported:",{current:r,last:i});continue}(i.operation==="CREATE"||i.operation==="WRITE")&&(r.operation==="RENAME"?s==="same_node"?(n[a]=[],n[t]=[{...i,path:r.toPath},...n[t]||[]]):s==="descendant"&&(n[a]=[],n[t]=[{...i,path:y(r.toPath,i.path.substring(r.path.length))},...n[t]||[]]):r.operation==="WRITE"&&s==="same_node"?n[a]=[]:r.operation==="DELETE"&&s==="same_node"&&(n[a]=[],n[t]=[]))}if(Object.entries(n).length>0){const a=e.flatMap((s,r)=>r in n?n[r]:[s]);return _(a)}}return e}function f(e,n){const t=e.path,a=e.operation!=="WRITE"&&e.nodeType==="directory",s=n.operation!=="WRITE"&&n.nodeType==="directory",r=n.operation==="RENAME"?n.toPath:n.path;return r===t?"same_node":s&&t.startsWith(r+"/")?"ancestor":a&&r.startsWith(t+"/")?"descendant":"none"}async function g(e,n){const a=n.filter(s=>s.operation==="WRITE").map(s=>$(e,s));return await Promise.all(a),n}const E=new m({concurrency:15});async function $(e,n){const t=await E.acquire();try{n.data=await e.readFileAsBuffer(n.path)}catch(a){u.warn(`Journal failed to hydrate a file on flush: the path ${n.path} no longer exists`),u.error(a)}t()}const q=`<?php

/**
 * Forces SQLite to use monotonically increasing values for every 
 * autoincrement column. For example, if sqlite_sequence says that
 * \`wp_posts\` has seq=10, the next row will get id=11.
 * 
 * ## How to use
 * 
 * * Call this function when starting the synchronized session.
 * * Call this function again every time a new autoincrement field is created.
 * 
 * ## Doesn't SQLite already do that?
 * 
 * Sadly, no.
 * 
 * SQLite always uses max(id) + 1 for the next autoincrement value
 * regardless of the seq value stored in sqlite_sequence.
 * 
 * This means trouble. Receiving a remote row with a high ID like 450000 
 * changes the next locally assigned ID from 11 to 450001. This is a 
 * certain way to get ID conflicts between peers.
 * 
 * Fortunately, we can create a trigger to force SQLite to use ID=seq+1
 * instead of its default algorithm.
 * 
 * ## Implementation
 *
 * We override the default AUTOINCREMENT algorithm with our own.
 * 
 * Instead of sqlite_sequence, we use a custom playground_sequence table
 * to store the next available ID for every table/column pair.
 * 
 * We use an AFTER INSERT trigger to reassign the AUTOINCREMENT value to the
 * next available value in the playground_sequence table.
 * 
 * The last_insert_id() function still returns the original ID assigned by SQLite,
 * so we introduce a new 'sqlite_last_insert_id' filter in class-wp-sqlite-translator.php
 * and use it to give WordPress the correct last_insert_id.
 * 
 * ## Alternatives considered
 * 
 * * Using a custom DEFAULT value for the PRIMARY KEY column – SQLite doesn't support it
 * * Update ID with a trigger BEFORE INSERT – SQLite doesn't support it
 * * Use INSTEAD OF triggers on a table – they only work with views
 * * Read the entire row after INSERTing it, and reconstruct the query – too complex and be error-prone
 * * Replace the ID column with a custom, non-autoincrement one – that's complex in SQLite plus it could mess up WP core db migrations
 * 
 * @param int|null $local_id_offset The offset to use for the first AUTOINCREMENT value.
 * @return void
 */
function playground_sync_override_autoincrement_algorithm($local_id_offset = null, $known_autoincrement_values = null)
{
    if (null !== $local_id_offset) {
        if (get_option('playground_id_offset')) {
            // For now, the initial offset may only be set once.
            // Changing it on the fly has no clear benefits, but
            // it would be a pain to implement correctly and would
            // introduce inconvenient gaps in the ID sequence.
            throw new Exception(
                "playground_sync_override_autoincrement_algorithm() was called twice with different " .
                "values for \\$local_id_offset. This is not supported."
            );
        }
        // Store the default autoincrement offset for the current peer:
        update_option('playground_id_offset', $local_id_offset);
    }

    if (null !== $known_autoincrement_values) {
        foreach ($known_autoincrement_values as $table_name => $seq) {
            $stmt = $GLOBALS['@pdo']->prepare(<<<SQL
                INSERT OR REPLACE INTO playground_sequence VALUES (:table_name, :seq)
            SQL
            );
            $stmt->execute([':table_name' => $table_name, ':seq' => $seq]);
        }
    }

    // Insert all the AUTOINCREMENT table/column pairs that are not
    // already tracked in playground_sequence:
    $pdo = $GLOBALS['@pdo'];
    $stmt = $pdo->prepare(<<<SQL
        INSERT INTO playground_sequence 
        SELECT table_name, :seq FROM autoincrement_columns
        WHERE 1=1 -- Needed because of the ambiguous ON clause, see https://sqlite.org/lang_upsert.html
        ON CONFLICT(table_name) DO NOTHING;
    SQL);
    $stmt->execute([':seq' => get_option('playground_id_offset')]);

    // Create any missing AFTER INSERT triggers:
    foreach (playground_sync_get_autoincrement_columns() as $table => $column) {
        $pdo->query(<<<SQL
            CREATE TRIGGER IF NOT EXISTS 
            force_seq_autoincrement_on_{$table}_{$column}
            AFTER INSERT ON $table
            FOR EACH ROW
            WHEN
                -- Don't run this trigger when we're replaying queries from another peer
                (SELECT value FROM playground_variables WHERE name = 'is_replaying') = 'no'
            BEGIN
                -- Update the inserted row with the next available ID
                UPDATE {$table} SET {$column} = (
                    SELECT seq FROM playground_sequence WHERE table_name = '{$table}'
                ) + 1 WHERE rowid = NEW.rowid;
                -- Record the ID that was just assigned
                UPDATE playground_sequence SET seq = seq + 1 WHERE table_name = '{$table}';
            END;
        SQL);
    }
}

/**
 * Same as playground_sync_override_autoincrement_algorithm(), only runs after
 * queries that modify the database schema, such as ALTER TABLE and CREATE TABLE.
 * 
 * @param string $query MySQL Query
 * @param string $query_type CREATE TABLE, ALTER TABLE, etc.
 * @return void
 */
function playground_sync_override_autoincrement_on_newly_created_fields($query, $query_type)
{
    if ($query_type === 'CREATE TABLE' || $query_type === 'ALTER TABLE') {
        playground_sync_override_autoincrement_algorithm();
    }
}

/**
 * Ensures that $wpdb gets the actual ID assigned to the last inserted row
 * as its $wpdb->insert_id value.
 * 
 * The AFTER INSERT trigger overrides AUTOINCREMENT IDs provided by SQLite.
 * However, the SQLite integration plugin uses the builtin last_insert_id() 
 * SQLite function which returns the original ID assigned by SQLite. That ID
 * is no longer in the database, but there is no way to override it at the
 * database level.
 * 
 * We must, therefore, act at the application level. This function replaces
 * the stale ID with the one assigned to the row by the AFTER INSERT trigger.
 * 
 * @see playground_autoincrement_override_algorithm
 * 
 * @param int $sqlite_last_insert_id The now-stale ID returned by last_insert_id().
 * @param string $table_name The table name.
 * @return int The ID actually stored in the last inserted row.
 */
function playground_sync_get_actual_last_insert_id($sqlite_last_insert_id, $table_name)
{
    // Get the last relevant value from playground_sequence:
    $stmt = $GLOBALS['@pdo']->prepare("SELECT * FROM playground_sequence WHERE table_name = :table_name");
    $stmt->execute([':table_name' => $table_name]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($result) {
        return $result['seq'];
    }
    return $sqlite_last_insert_id;
}
/**
 * Returns all auto-increment columns keyed by their table name.
 *
 * @return array A [$table => $column] array of all auto-increment columns.
 */
function playground_sync_get_autoincrement_columns()
{
    return $GLOBALS['@pdo']
        ->query('SELECT table_name, column_name FROM autoincrement_columns')
        ->fetchAll(PDO::FETCH_KEY_PAIR);
}

/**
 * Ensures that all the tables and views required by the synchronization
 * process exist.
 *
 * This function may be called multiple times without causing an error.
 * 
 * @return void
 */
function playground_sync_ensure_required_tables()
{
    $pdo = $GLOBALS['@pdo'];
    /** @var PDO $pdo */
    $pdo->query("CREATE TABLE IF NOT EXISTS playground_variables (
        name TEXT PRIMARY KEY,
        value TEXT
    );");
    $pdo->query("CREATE TABLE IF NOT EXISTS playground_sequence (
        table_name varchar(255),
        seq int default 0 not null,
        PRIMARY KEY (table_name)
    )");

    $pdo->query(<<<SQL
    CREATE VIEW IF NOT EXISTS autoincrement_columns AS 
        SELECT DISTINCT m.name as 'table_name', ti.name AS 'column_name'
            FROM
                sqlite_schema AS m,
                pragma_table_info(m.name) AS ti
            INNER JOIN sqlite_sequence seq ON seq.name = m.name
            WHERE
                m.type = 'table' AND
                m.name NOT LIKE 'sqlite_%' AND
                ti.pk = 1 AND -- pk stands for primary key
                ti.type LIKE '%INTEGER%'
            ORDER BY 1
    ;
    SQL
    );
}

/**
 * Emits a SQL query to the JavaScript side of the Playground Sync
 * feature.
 *
 * If the query is an INSERT and the local database implicitly assigned
 * a primary key, this function will send the inserted rows instead of
 * the original query. We do this because the original query doesn't
 * give the remote peer enough information to reconstruct the row.
 *
 * @param string $query The SQL query to emit.
 * @param string $query_type The type of the SQL query (e.g. SELECT, INSERT, UPDATE, DELETE).
 * @param string $table_name The name of the table affected by the SQL query.
 * @param array $insert_columns The columns affected by the INSERT query.
 * @param int $last_insert_id The ID of the last inserted row (if applicable).
 * @param int $affected_rows The number of affected rows.
 * @return void
 */
function playground_sync_emit_mysql_query($query, $query_type, $table_name, $insert_columns, $last_insert_id, $affected_rows)
{
    // Is it an INSERT that generated a new autoincrement value?
    static $auto_increment_columns = null;
    if ($auto_increment_columns === null) {
        $auto_increment_columns = playground_sync_get_autoincrement_columns();
    }
    $auto_increment_column = $auto_increment_columns[$table_name] ?? null;

    $was_pk_generated = $query_type === 'INSERT' && $auto_increment_column && !in_array($auto_increment_column, $insert_columns, true);
    if ($was_pk_generated) {
        // If so, get the inserted rows.
        // It could be more than one, e.g. if the query was \`INSERT INTO ... SELECT ...\`.
        $rows = $GLOBALS['@pdo']->query(<<<SQL
            SELECT * FROM $table_name
            WHERE $auto_increment_column <= $last_insert_id
            ORDER BY $auto_increment_column DESC
            LIMIT $affected_rows
        SQL
        )->fetchAll(PDO::FETCH_ASSOC);
        // Finally, send each row to the JavaScript side.
        foreach ($rows as $row) {
            $row[$auto_increment_column] = (int) $row[$auto_increment_column];
            post_message_to_js(json_encode([
                'type' => 'sql',
                'subtype' => 'reconstruct-insert',
                'row' => $row,
                'query_type' => $query_type,
                'table_name' => $table_name,
                'auto_increment_column' => $auto_increment_column,
                'last_insert_id' => $last_insert_id,
            ]));
        }
        return;
    }

    // Otherwise, simply send the query to the JavaScript side.
    post_message_to_js(json_encode([
        'type' => 'sql',
        'subtype' => 'replay-query',
        'query' => $query,
        'query_type' => $query_type,
        'table_name' => $table_name,
        'auto_increment_column' => $auto_increment_column,
        'last_insert_id' => $last_insert_id,
    ]));
}

/**
 * Emits a transaction-related query to the JavaScript side of the 
 * Playground Sync.
 *
 * @param string $command The SQL statement (one of "START TRANSACTION", "COMMIT", "ROLLBACK").
 * @param bool $success Whether the SQL statement was successful or not.
 * @param int $nesting_level The nesting level of the transaction.
 * @return void
 */
function playground_sync_emit_transaction_query($command, $success, $nesting_level)
{
    // If we're in a nested transaction, SQLite won't really
    // persist anything to the database. Let's ignore it and wait
    // for the outermost transaction to finish.
    if (0 !== $nesting_level) {
        return;
    }

    post_message_to_js(json_encode([
        'type' => 'sql',
        'subtype' => 'transaction',
        'success' => $success,
        'command' => $command,
    ]));
}

/**
 * Replays a list of SQL queries on a local database.
 * 
 * @param array $queries An array of SQL queries to run.
 * @return void
 */
function playground_sync_replay_sql_journal($queries)
{
    global $wpdb;
    $pdo = $GLOBALS['@pdo'];
    foreach ($queries as $query) {
        try {
            // If another peer assigned an autoincrement value, we don't get
            // the query but a key/value representation of the inserted row.
            // Let's reconstruct the INSERT query using that data.
            // Because we use prepared statements here, we cannot simply reconstruct the
            // insert on the other end.
            if ($query['subtype'] === 'reconstruct-insert') {
                $table_name = $query['table_name'];
                $columns = implode(', ', array_keys($query['row']));
                $placeholders = ':' . implode(', :', array_keys($query['row']));

                $stmt = $pdo->prepare("INSERT INTO $table_name ($columns) VALUES ($placeholders)");
                $stmt->execute($query['row']);
            } else {
                $wpdb->query($query['query']);
            }
        } catch (PDOException $e) {
            // Let's ignore errors related to UNIQUE constraints violation for now.
            // They often relate to transient data that is not relevant to the
            // synchronization process.
            //
            // This probably means we won't catch some legitimate issues.
            // Let's keep an eye on this and see if we can eventually remove it.
            // In the future, let's implement pattern matching on queries and
            // prevent synchronizing transient data. 

            // SQLSTATE[23000]: Integrity constraint violation: 19 UNIQUE constraint failed
            if ($e->getCode() === "23000") {
                continue;
            }
            throw $e;
        }
    }
}

/**
 * Sets up WordPress for a synchronized exchange of SQLite queries.
 * 
 * @return void
 */
function playground_sync_start()
{
    playground_sync_ensure_required_tables();

    // Don't override the AUTOINCREMENT IDs when replaying queries from 
    // another peer. The AFTER INSERT trigger will abstain from running
    // when \`is_replaying\` is set to "yes".
    $pdo = $GLOBALS['@pdo'];
    $stmt = $pdo->prepare("INSERT OR REPLACE INTO playground_variables VALUES ('is_replaying', :is_replaying);");
    $is_replaying = defined('REPLAYING_SQL') && REPLAYING_SQL;
    $stmt->execute([':is_replaying' => $is_replaying ? 'yes' : 'no']);

    // Don't emit SQL queries we're just replaying from another peer.
    if (!$is_replaying) {
        add_filter('sqlite_last_insert_id', 'playground_sync_get_actual_last_insert_id', 0, 2);

        // Listens for SQL queries executed by WordPress and emit them to the JS side:
        // @todo – consider using SQLite's "update hook" instead of "sqlite_post_query" WordPress hook here.
        add_action('sqlite_translated_query_executed', 'playground_sync_emit_mysql_query', -1000, 6);
        add_action('sqlite_transaction_query_executed', 'playground_sync_emit_transaction_query', -1000, 3);
    }

    add_filter('sqlite_translated_query_executed', 'playground_sync_override_autoincrement_on_newly_created_fields', -1000, 2);
}

playground_sync_start();`;async function w(e){await e.fileExists("/wordpress/wp-content/mu-plugins")||await e.mkdir("/wordpress/wp-content/mu-plugins"),await e.writeFile("/wordpress/wp-content/mu-plugins/sync-mu-plugin.php",q)}async function T(e,n,t={}){const a=await e.run({code:`<?php
        require '/wordpress/wp-load.php';
        playground_sync_override_autoincrement_algorithm(
			${c(n)},
			${c(t)}
		);
	    `});return p(a,"Initialization failed."),(await e.run({code:`<?php
        require '/wordpress/wp-load.php';
		$data = $GLOBALS['@pdo']
			->query('SELECT * FROM playground_sequence')
			->fetchAll(PDO::FETCH_KEY_PAIR);
		echo json_encode($data);
		`})).json}async function S(e,n){let t=null;e.addEventListener("request.end",()=>{t=null}),e.onMessage(async a=>{const s=JSON.parse(a);if(s?.type==="sql"){if(s.subtype==="transaction"){const r=s;if(!r.success)return;switch(r.command){case"START TRANSACTION":t=[];break;case"COMMIT":t?.length&&t.forEach(n),t=null;break;case"ROLLBACK":t=null;break}return}if(s.subtype==="replay-query"||s.subtype==="reconstruct-insert"){const r=s;t?t.push(r):n(r)}}})}async function b(e,n){const t=h({journal:n}),a=await e.run({code:`<?php
		// Prevent reporting changes from queries we're just replaying
		define('REPLAYING_SQL', true);

		// Only load WordPress and replay the SQL queries now
		require '/wordpress/wp-load.php';
		playground_sync_replay_sql_journal(${t.journal});
	`});p(a,"Replay error.")}function p(e,n){if(e.text.trim()||e.errors.trim())throw u.error({text:e.text,errors:e.errors}),new Error(`${n}. See the console for more details.`)}async function R(e,n){await e.journalFSEvents("/wordpress/wp-content",async t=>{t.path.endsWith("/.ht.sqlite")||t.path.endsWith("/.ht.sqlite-journal")||n(t)})}class C{sendChanges(n){window.top.postMessage({type:"playground-change",envelope:n},"*")}onChangesReceived(n){window.addEventListener("message",t=>{t.data.type==="playground-change"&&n(t.data.envelope)})}}class Q{sendChanges(){}onChangesReceived(n){this.injectChanges=n}injectChanges(n){}}function D(e){return{beforeSend:n=>((n.sql.length>0||n.fs.length>0)&&u.log(`[${e}] Sending changes`,n),n),afterReceive:n=>(u.log(`[${e}] Received changes`,n),n)}}const L=(e,n="https://playground.wordpress.net")=>({beforeSend:d(e,n),afterReceive:d(n,e)});function d(e,n){e=e.replace(/\/$/,""),n=n.replace(/\/$/,"");const t=new RegExp(`(^|[^0-9a-zA-Z])(?:${I(e)})($|[^0-9a-zA-Z])`,"g"),a=`$1${n}$2`;return s=>({...s,sql:s.sql.map(r=>{if(r.subtype==="replay-query")return{...r,query:r.query.replace(e,n)};if(r.subtype==="reconstruct-insert"){const i={...r.row};for(const o in i)typeof i[o]=="string"&&(i[o]=i[o].replace(t,a));return{...r,row:i}}return r})})}function I(e){return e.replace(/[/\-\\^$*+?.()|[\]{}]/g,"\\$&")}const A=()=>({beforeSend:e=>({...e,sql:e.sql.filter(v)}),afterReceive:e=>e}),v=e=>{if(e.query_type==="SELECT")return!1;const n=e.query_type,t=e.table_name?.toLowerCase();if(e.subtype==="replay-query"){const a=e.query.trim();if(n==="UPDATE"&&t==="wp_options"&&a.endsWith("`option_name` = 'cron'"))return!1}if(e.subtype==="reconstruct-insert"){if(t==="wp_options"){const a=e.row.option_name+"";if(a.startsWith("_transient_")||a.startsWith("_site_transient_"))return!1}if(t==="wp_usermeta"&&e.row.meta_key==="session_tokens")return!1}return!0},N=e=>({beforeSend:async n=>({...n,fs:await g(e,_(n.fs))}),afterReceive:n=>n});async function F(e,{autoincrementOffset:n,transport:t,middlewares:a=[]}){a=[A(),L(await e.absoluteUrl),N(e),...a],await w(e),await T(e,n),t.onChangesReceived(async o=>{for(const l of a)o=await l.afterReceive(o);await e.replayFSJournal(o.fs),await b(e,o.sql)});let s={fs:[],sql:[]};S(e,o=>{s.sql.push(o)}),R(e,o=>{s.fs.push(o)});const r=async()=>{let o=s;s={fs:[],sql:[]};for(const l of a)o=await l.beforeSend(o);!o.sql.length&&!o.fs.length||t.sendChanges(o)},i=async(o,l)=>{await o(),setTimeout(i,l,o,l)};i(r,3e3)}export{Q as N,C as P,D as l,F as s};
