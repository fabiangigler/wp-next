const q = function() {
  var n;
  return typeof process < "u" && ((n = process.release) == null ? void 0 : n.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : (
    // @ts-ignore
    typeof WorkerGlobalScope < "u" && // @ts-ignore
    self instanceof WorkerGlobalScope ? "WORKER" : "NODE"
  );
}();
if (q === "NODE") {
  let n = function(t) {
    return new Promise(function(r, s) {
      t.onload = t.onerror = function(o) {
        t.onload = t.onerror = null, o.type === "load" ? r(t.result) : s(new Error("Failed to read the blob/file"));
      };
    });
  }, e = function() {
    const t = new Uint8Array([1, 2, 3, 4]), s = new File([t], "test").stream();
    try {
      return s.getReader({ mode: "byob" }), !0;
    } catch {
      return !1;
    }
  };
  if (typeof File > "u") {
    class t extends Blob {
      constructor(s, o, a) {
        super(s);
        let i;
        a != null && a.lastModified && (i = /* @__PURE__ */ new Date()), (!i || isNaN(i.getFullYear())) && (i = /* @__PURE__ */ new Date()), this.lastModifiedDate = i, this.lastModified = i.getMilliseconds(), this.name = o || "";
      }
    }
    global.File = t;
  }
  typeof Blob.prototype.arrayBuffer > "u" && (Blob.prototype.arrayBuffer = function() {
    const r = new FileReader();
    return r.readAsArrayBuffer(this), n(r);
  }), typeof Blob.prototype.text > "u" && (Blob.prototype.text = function() {
    const r = new FileReader();
    return r.readAsText(this), n(r);
  }), (typeof Blob.prototype.stream > "u" || !e()) && (Blob.prototype.stream = function() {
    let t = 0;
    const r = this;
    return new ReadableStream({
      type: "bytes",
      // 0.5 MB seems like a reasonable chunk size, let's adjust
      // this if needed.
      autoAllocateChunkSize: 512 * 1024,
      async pull(s) {
        const o = s.byobRequest.view, i = await r.slice(
          t,
          t + o.byteLength
        ).arrayBuffer(), l = new Uint8Array(i);
        new Uint8Array(o.buffer).set(l);
        const m = l.byteLength;
        s.byobRequest.respond(m), t += m, t >= r.size && s.close();
      }
    });
  });
}
if (q === "NODE" && typeof CustomEvent > "u") {
  class n extends Event {
    constructor(t, r = {}) {
      super(t, r), this.detail = r.detail;
    }
    initCustomEvent() {
    }
  }
  globalThis.CustomEvent = n;
}
const N = "playground-log", b = (n, ...e) => {
  f.dispatchEvent(
    new CustomEvent(N, {
      detail: {
        log: n,
        args: e
      }
    })
  );
}, O = (n, ...e) => {
  switch (typeof n.message == "string" ? n.message = _(n.message) : n.message.message && typeof n.message.message == "string" && (n.message.message = _(n.message.message)), n.severity) {
    case "Debug":
      console.debug(n.message, ...e);
      break;
    case "Info":
      console.info(n.message, ...e);
      break;
    case "Warn":
      console.warn(n.message, ...e);
      break;
    case "Error":
      console.error(n.message, ...e);
      break;
    case "Fatal":
      console.error(n.message, ...e);
      break;
    default:
      console.log(n.message, ...e);
  }
}, C = (n) => n instanceof Error ? [n.message, n.stack].join(`
`) : JSON.stringify(n, null, 2), S = [], $ = (n) => {
  S.push(n);
}, h = (n) => {
  if (n.raw === !0)
    $(n.message);
  else {
    const e = F(
      typeof n.message == "object" ? C(n.message) : n.message,
      n.severity ?? "Info",
      n.prefix ?? "JavaScript"
    );
    $(e);
  }
};
class D extends EventTarget {
  // constructor
  constructor(e = []) {
    super(), this.handlers = e, this.fatalErrorEvent = "playground-fatal-error";
  }
  /**
   * Get all logs.
   * @returns string[]
   */
  getLogs() {
    return this.handlers.includes(h) ? [...S] : (this.error(`Logs aren't stored because the logToMemory handler isn't registered.
				If you're using a custom logger instance, make sure to register logToMemory handler.
			`), []);
  }
  /**
   * Log message with severity.
   *
   * @param message any
   * @param severity LogSeverity
   * @param raw boolean
   * @param args any
   */
  logMessage(e, ...t) {
    for (const r of this.handlers)
      r(e, ...t);
  }
  /**
   * Log message
   *
   * @param message any
   * @param args any
   */
  log(e, ...t) {
    this.logMessage(
      {
        message: e,
        severity: void 0,
        prefix: "JavaScript",
        raw: !1
      },
      ...t
    );
  }
  /**
   * Log debug message
   *
   * @param message any
   * @param args any
   */
  debug(e, ...t) {
    this.logMessage(
      {
        message: e,
        severity: "Debug",
        prefix: "JavaScript",
        raw: !1
      },
      ...t
    );
  }
  /**
   * Log info message
   *
   * @param message any
   * @param args any
   */
  info(e, ...t) {
    this.logMessage(
      {
        message: e,
        severity: "Info",
        prefix: "JavaScript",
        raw: !1
      },
      ...t
    );
  }
  /**
   * Log warning message
   *
   * @param message any
   * @param args any
   */
  warn(e, ...t) {
    this.logMessage(
      {
        message: e,
        severity: "Warn",
        prefix: "JavaScript",
        raw: !1
      },
      ...t
    );
  }
  /**
   * Log error message
   *
   * @param message any
   * @param args any
   */
  error(e, ...t) {
    this.logMessage(
      {
        message: e,
        severity: "Error",
        prefix: "JavaScript",
        raw: !1
      },
      ...t
    );
  }
}
const k = () => {
  try {
    if (process.env.NODE_ENV === "test")
      return [h, b];
  } catch {
  }
  return [h, O, b];
}, f = new D(k()), _ = (n) => n.replace(/\t/g, ""), F = (n, e, t) => {
  const r = /* @__PURE__ */ new Date(), s = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  }).format(r).replace(/ /g, "-"), o = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !1,
    timeZone: "UTC",
    timeZoneName: "short"
  }).format(r), a = s + " " + o;
  return n = _(n), `[${a}] ${t} ${e}: ${n}`;
}, x = `<?php

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

playground_sync_start();`, v = Symbol("SleepFinished");
function B(n) {
  return new Promise((e) => {
    setTimeout(() => e(v), n);
  });
}
class M extends Error {
  constructor() {
    super("Acquiring lock timed out");
  }
}
class P {
  constructor({ concurrency: e, timeout: t }) {
    this._running = 0, this.concurrency = e, this.timeout = t, this.queue = [];
  }
  get remaining() {
    return this.concurrency - this.running;
  }
  get running() {
    return this._running;
  }
  async acquire() {
    for (; ; )
      if (this._running >= this.concurrency) {
        const e = new Promise((t) => {
          this.queue.push(t);
        });
        this.timeout !== void 0 ? await Promise.race([e, B(this.timeout)]).then(
          (t) => {
            if (t === v)
              throw new M();
          }
        ) : await e;
      } else {
        this._running++;
        let e = !1;
        return () => {
          e || (e = !0, this._running--, this.queue.length > 0 && this.queue.shift()());
        };
      }
  }
  async run(e) {
    const t = await this.acquire();
    try {
      return await e();
    } finally {
      t();
    }
  }
}
function g(...n) {
  let e = n.join("/");
  const t = e[0] === "/", r = e.substring(e.length - 1) === "/";
  return e = R(e), !e && !t && (e = "."), e && r && (e += "/"), e;
}
function Q(n) {
  if (n === "/")
    return "/";
  n = R(n);
  const e = n.lastIndexOf("/");
  return e === -1 ? "" : e === 0 ? "/" : n.substr(0, e);
}
function R(n) {
  const e = n[0] === "/";
  return n = W(
    n.split("/").filter((t) => !!t),
    !e
  ).join("/"), (e ? "/" : "") + n.replace(/\/$/, "");
}
function W(n, e) {
  let t = 0;
  for (let r = n.length - 1; r >= 0; r--) {
    const s = n[r];
    s === "." ? n.splice(r, 1) : s === ".." ? (n.splice(r, 1), t++) : t && (n.splice(r, 1), t--);
  }
  if (e)
    for (; t; t--)
      n.unshift("..");
  return n;
}
function E(n) {
  return `json_decode(base64_decode('${j(
    JSON.stringify(n)
  )}'), true)`;
}
function G(n) {
  const e = {};
  for (const t in n)
    e[t] = E(n[t]);
  return e;
}
function j(n) {
  return U(new TextEncoder().encode(n));
}
function U(n) {
  const e = String.fromCodePoint(...n);
  return btoa(e);
}
async function H(n) {
  await n.fileExists("/wordpress/wp-content/mu-plugins") || await n.mkdir("/wordpress/wp-content/mu-plugins"), await n.writeFile(
    "/wordpress/wp-content/mu-plugins/sync-mu-plugin.php",
    x
  );
}
async function J(n, e, t = {}) {
  const r = await n.run({
    code: `<?php
        require '/wordpress/wp-load.php';
        playground_sync_override_autoincrement_algorithm(
			${E(e)},
			${E(t)}
		);
	    `
  });
  return I(r, "Initialization failed."), (await n.run({
    code: `<?php
        require '/wordpress/wp-load.php';
		$data = $GLOBALS['@pdo']
			->query('SELECT * FROM playground_sequence')
			->fetchAll(PDO::FETCH_KEY_PAIR);
		echo json_encode($data);
		`
  })).json;
}
async function z(n, e) {
  let t = null;
  n.addEventListener("request.end", () => {
    t = null;
  }), n.onMessage(async (r) => {
    const s = JSON.parse(r);
    if ((s == null ? void 0 : s.type) === "sql") {
      if (s.subtype === "transaction") {
        const o = s;
        if (!o.success)
          return;
        switch (o.command) {
          case "START TRANSACTION":
            t = [];
            break;
          case "COMMIT":
            t != null && t.length && t.forEach(e), t = null;
            break;
          case "ROLLBACK":
            t = null;
            break;
        }
        return;
      }
      if (s.subtype === "replay-query" || s.subtype === "reconstruct-insert") {
        const o = s;
        t ? t.push(o) : e(o);
      }
    }
  });
}
async function Y(n, e) {
  const t = G({ journal: e }), r = await n.run({
    code: `<?php
		// Prevent reporting changes from queries we're just replaying
		define('REPLAYING_SQL', true);

		// Only load WordPress and replay the SQL queries now
		require '/wordpress/wp-load.php';
		playground_sync_replay_sql_journal(${t.journal});
	`
  });
  I(r, "Replay error.");
}
function I(n, e) {
  if (n.text.trim() || n.errors.trim())
    throw f.error({
      text: n.text,
      errors: n.errors
    }), new Error(`${e}. See the console for more details.`);
}
async function K(n, e) {
  await n.journalFSEvents(
    "/wordpress/wp-content",
    async (t) => {
      t.path.endsWith("/.ht.sqlite") || t.path.endsWith("/.ht.sqlite-journal") || e(t);
    }
  );
}
class ue {
  sendChanges(e) {
    window.top.postMessage(
      {
        type: "playground-change",
        envelope: e
      },
      "*"
    );
  }
  onChangesReceived(e) {
    window.addEventListener("message", (t) => {
      t.data.type === "playground-change" && e(t.data.envelope);
    });
  }
}
class ce {
  sendChanges() {
  }
  onChangesReceived(e) {
    this.injectChanges = e;
  }
  injectChanges(e) {
  }
}
const de = (n) => ({
  beforeSend: (e) => ({
    ...e,
    sql: e.sql.map((t) => (t.subtype === "reconstruct-insert" && n(t.table_name, t.last_insert_id), t))
  }),
  afterReceive: (e) => e
});
function pe(n) {
  return {
    beforeSend: (e) => ((e.sql.length > 0 || e.fs.length > 0) && f.log(`[${n}] Sending changes`, e), e),
    afterReceive: (e) => (f.log(`[${n}] Received changes`, e), e)
  };
}
const V = (n, e = "https://playground.wordpress.net") => ({
  beforeSend: T(n, e),
  afterReceive: T(e, n)
});
function T(n, e) {
  n = n.replace(/\/$/, ""), e = e.replace(/\/$/, "");
  const t = new RegExp(
    `(^|[^0-9a-zA-Z])(?:${X(n)})($|[^0-9a-zA-Z])`,
    "g"
  ), r = `$1${e}$2`;
  return (s) => ({
    ...s,
    sql: s.sql.map((o) => {
      if (o.subtype === "replay-query")
        return {
          ...o,
          query: o.query.replace(n, e)
        };
      if (o.subtype === "reconstruct-insert") {
        const a = { ...o.row };
        for (const i in a)
          typeof a[i] == "string" && (a[i] = a[i].replace(
            t,
            r
          ));
        return {
          ...o,
          row: a
        };
      }
      return o;
    })
  });
}
function X(n) {
  return n.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
}
const Z = () => ({
  beforeSend: (n) => ({
    ...n,
    sql: n.sql.filter(ee)
  }),
  afterReceive: (n) => n
}), ee = (n) => {
  var r;
  if (n.query_type === "SELECT")
    return !1;
  const e = n.query_type, t = (r = n.table_name) == null ? void 0 : r.toLowerCase();
  if (n.subtype === "replay-query") {
    const s = n.query.trim();
    if (e === "UPDATE" && t === "wp_options" && s.endsWith("`option_name` = 'cron'"))
      return !1;
  }
  if (n.subtype === "reconstruct-insert") {
    if (t === "wp_options") {
      const s = n.row.option_name + "";
      if (s.startsWith("_transient_") || s.startsWith("_site_transient_"))
        return !1;
    }
    if (t === "wp_usermeta" && n.row.meta_key === "session_tokens")
      return !1;
  }
  return !0;
}, y = {
  0: "No error occurred. System call completed successfully.",
  1: "Argument list too long.",
  2: "Permission denied.",
  3: "Address in use.",
  4: "Address not available.",
  5: "Address family not supported.",
  6: "Resource unavailable, or operation would block.",
  7: "Connection already in progress.",
  8: "Bad file descriptor.",
  9: "Bad message.",
  10: "Device or resource busy.",
  11: "Operation canceled.",
  12: "No child processes.",
  13: "Connection aborted.",
  14: "Connection refused.",
  15: "Connection reset.",
  16: "Resource deadlock would occur.",
  17: "Destination address required.",
  18: "Mathematics argument out of domain of function.",
  19: "Reserved.",
  20: "File exists.",
  21: "Bad address.",
  22: "File too large.",
  23: "Host is unreachable.",
  24: "Identifier removed.",
  25: "Illegal byte sequence.",
  26: "Operation in progress.",
  27: "Interrupted function.",
  28: "Invalid argument.",
  29: "I/O error.",
  30: "Socket is connected.",
  31: "There is a directory under that path.",
  32: "Too many levels of symbolic links.",
  33: "File descriptor value too large.",
  34: "Too many links.",
  35: "Message too large.",
  36: "Reserved.",
  37: "Filename too long.",
  38: "Network is down.",
  39: "Connection aborted by network.",
  40: "Network unreachable.",
  41: "Too many files open in system.",
  42: "No buffer space available.",
  43: "No such device.",
  44: "There is no such file or directory OR the parent directory does not exist.",
  45: "Executable file format error.",
  46: "No locks available.",
  47: "Reserved.",
  48: "Not enough space.",
  49: "No message of the desired type.",
  50: "Protocol not available.",
  51: "No space left on device.",
  52: "Function not supported.",
  53: "The socket is not connected.",
  54: "Not a directory or a symbolic link to a directory.",
  55: "Directory not empty.",
  56: "State not recoverable.",
  57: "Not a socket.",
  58: "Not supported, or operation not supported on socket.",
  59: "Inappropriate I/O control operation.",
  60: "No such device or address.",
  61: "Value too large to be stored in data type.",
  62: "Previous owner died.",
  63: "Operation not permitted.",
  64: "Broken pipe.",
  65: "Protocol error.",
  66: "Protocol not supported.",
  67: "Protocol wrong type for socket.",
  68: "Result too large.",
  69: "Read-only file system.",
  70: "Invalid seek.",
  71: "No such process.",
  72: "Reserved.",
  73: "Connection timed out.",
  74: "Text file busy.",
  75: "Cross-device link.",
  76: "Extension: Capabilities insufficient."
};
function ne(n) {
  const e = typeof n == "object" ? n == null ? void 0 : n.errno : null;
  if (e in y)
    return y[e];
}
function c(n = "") {
  return function(t, r, s) {
    const o = s.value;
    s.value = function(...a) {
      try {
        return o.apply(this, a);
      } catch (i) {
        const l = typeof i == "object" ? i == null ? void 0 : i.errno : null;
        if (l in y) {
          const m = y[l], w = typeof a[1] == "string" ? a[1] : null, A = w !== null ? n.replaceAll("{path}", w) : n;
          throw new Error(`${A}: ${m}`, {
            cause: i
          });
        }
        throw i;
      }
    };
  };
}
var te = Object.defineProperty, re = Object.getOwnPropertyDescriptor, d = (n, e, t, r) => {
  for (var s = r > 1 ? void 0 : r ? re(e, t) : e, o = n.length - 1, a; o >= 0; o--)
    (a = n[o]) && (s = (r ? a(e, t, s) : a(s)) || s);
  return r && s && te(e, t, s), s;
};
const p = class u {
  static readFileAsText(e, t) {
    return new TextDecoder().decode(u.readFileAsBuffer(e, t));
  }
  static readFileAsBuffer(e, t) {
    return e.readFile(t);
  }
  static writeFile(e, t, r) {
    e.writeFile(t, r);
  }
  static unlink(e, t) {
    e.unlink(t);
  }
  /**
   * Moves a file or directory in the PHP filesystem to a
   * new location.
   *
   * @param oldPath The path to rename.
   * @param newPath The new path.
   */
  static mv(e, t, r) {
    try {
      const s = e.lookupPath(t).node.mount, o = u.fileExists(e, r) ? e.lookupPath(r).node.mount : e.lookupPath(Q(r)).node.mount;
      s.mountpoint !== o.mountpoint ? (u.copyRecursive(e, t, r), u.rmdir(e, t, { recursive: !0 })) : e.rename(t, r);
    } catch (s) {
      const o = ne(s);
      throw o ? new Error(
        `Could not move ${t} to ${r}: ${o}`,
        {
          cause: s
        }
      ) : s;
    }
  }
  static rmdir(e, t, r = { recursive: !0 }) {
    r != null && r.recursive && u.listFiles(e, t).forEach((s) => {
      const o = `${t}/${s}`;
      u.isDir(e, o) ? u.rmdir(e, o, r) : u.unlink(e, o);
    }), e.rmdir(t);
  }
  static listFiles(e, t, r = { prependPath: !1 }) {
    if (!u.fileExists(e, t))
      return [];
    try {
      const s = e.readdir(t).filter(
        (o) => o !== "." && o !== ".."
      );
      if (r.prependPath) {
        const o = t.replace(/\/$/, "");
        return s.map((a) => `${o}/${a}`);
      }
      return s;
    } catch (s) {
      return f.error(s, { path: t }), [];
    }
  }
  static isDir(e, t) {
    return u.fileExists(e, t) ? e.isDir(e.lookupPath(t).node.mode) : !1;
  }
  static fileExists(e, t) {
    try {
      return e.lookupPath(t), !0;
    } catch {
      return !1;
    }
  }
  static mkdir(e, t) {
    e.mkdirTree(t);
  }
  static copyRecursive(e, t, r) {
    const s = e.lookupPath(t).node;
    if (e.isDir(s.mode)) {
      e.mkdirTree(r);
      const o = e.readdir(t).filter(
        (a) => a !== "." && a !== ".."
      );
      for (const a of o)
        u.copyRecursive(
          e,
          g(t, a),
          g(r, a)
        );
    } else
      e.writeFile(r, e.readFile(t));
  }
};
d([
  c('Could not read "{path}"')
], p, "readFileAsText", 1);
d([
  c('Could not read "{path}"')
], p, "readFileAsBuffer", 1);
d([
  c('Could not write to "{path}"')
], p, "writeFile", 1);
d([
  c('Could not unlink "{path}"')
], p, "unlink", 1);
d([
  c('Could not remove directory "{path}"')
], p, "rmdir", 1);
d([
  c('Could not list files in "{path}"')
], p, "listFiles", 1);
d([
  c('Could not stat "{path}"')
], p, "isDir", 1);
d([
  c('Could not stat "{path}"')
], p, "fileExists", 1);
d([
  c('Could not create directory "{path}"')
], p, "mkdir", 1);
d([
  c('Could not copy files from "{path}"')
], p, "copyRecursive", 1);
(function() {
  var n;
  return typeof process < "u" && ((n = process.release) == null ? void 0 : n.name) === "node" ? "NODE" : typeof window < "u" ? "WEB" : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? "WORKER" : "NODE";
})();
ReadableStream.prototype[Symbol.asyncIterator] || (ReadableStream.prototype[Symbol.asyncIterator] = async function* () {
  const n = this.getReader();
  try {
    for (; ; ) {
      const { done: e, value: t } = await n.read();
      if (e)
        return;
      yield t;
    }
  } finally {
    n.releaseLock();
  }
}, ReadableStream.prototype.iterate = // @ts-ignore
ReadableStream.prototype[Symbol.asyncIterator]);
function L(n) {
  const e = {};
  for (let t = n.length - 1; t >= 0; t--) {
    for (let r = t - 1; r >= 0; r--) {
      const s = se(n[t], n[r]);
      if (s === "none")
        continue;
      const o = n[t], a = n[r];
      if (o.operation === "RENAME" && a.operation === "RENAME") {
        f.warn(
          "[FS Journal] Normalizing a double rename is not yet supported:",
          {
            current: o,
            last: a
          }
        );
        continue;
      }
      (a.operation === "CREATE" || a.operation === "WRITE") && (o.operation === "RENAME" ? s === "same_node" ? (e[r] = [], e[t] = [
        {
          ...a,
          path: o.toPath
        },
        ...e[t] || []
      ]) : s === "descendant" && (e[r] = [], e[t] = [
        {
          ...a,
          path: g(
            o.toPath,
            a.path.substring(o.path.length)
          )
        },
        ...e[t] || []
      ]) : o.operation === "WRITE" && s === "same_node" ? e[r] = [] : o.operation === "DELETE" && s === "same_node" && (e[r] = [], e[t] = []));
    }
    if (Object.entries(e).length > 0) {
      const r = n.flatMap((s, o) => o in e ? e[o] : [s]);
      return L(r);
    }
  }
  return n;
}
function se(n, e) {
  const t = n.path, r = n.operation !== "WRITE" && n.nodeType === "directory", s = e.operation !== "WRITE" && e.nodeType === "directory", o = e.operation === "RENAME" ? e.toPath : e.path;
  return o === t ? "same_node" : s && t.startsWith(o + "/") ? "ancestor" : r && o.startsWith(t + "/") ? "descendant" : "none";
}
async function oe(n, e) {
  const r = e.filter(
    (s) => s.operation === "WRITE"
  ).map((s) => ie(n, s));
  return await Promise.all(r), e;
}
const ae = new P({ concurrency: 15 });
async function ie(n, e) {
  const t = await ae.acquire();
  try {
    e.data = await n.readFileAsBuffer(e.path);
  } catch (r) {
    f.warn(
      `Journal failed to hydrate a file on flush: the path ${e.path} no longer exists`
    ), f.error(r);
  }
  t();
}
const le = (n) => ({
  beforeSend: async (e) => ({
    ...e,
    fs: await oe(
      n,
      L(e.fs)
    )
  }),
  afterReceive: (e) => e
});
async function fe(n, { autoincrementOffset: e, transport: t, middlewares: r = [] }) {
  r = [
    Z(),
    V(await n.absoluteUrl),
    le(n),
    ...r
  ], await H(n), await J(n, e), t.onChangesReceived(async (i) => {
    for (const l of r)
      i = await l.afterReceive(i);
    await n.replayFSJournal(i.fs), await Y(n, i.sql);
  });
  let s = { fs: [], sql: [] };
  z(n, (i) => {
    s.sql.push(i);
  }), K(n, (i) => {
    s.fs.push(i);
  });
  const o = async () => {
    let i = s;
    s = { fs: [], sql: [] };
    for (const l of r)
      i = await l.beforeSend(i);
    !i.sql.length && !i.fs.length || t.sendChanges(i);
  }, a = async (i, l) => {
    await i(), setTimeout(a, l, i, l);
  };
  a(o, 3e3);
}
export {
  ce as NoopTransport,
  ue as ParentWindowTransport,
  H as installSqlSyncMuPlugin,
  K as journalFSOperations,
  z as journalSQLQueries,
  pe as loggerMiddleware,
  V as marshallSiteURLMiddleware,
  J as overrideAutoincrementSequences,
  Y as replaySQLJournal,
  fe as setupPlaygroundSync,
  de as trackAutoincrementMiddleware
};
