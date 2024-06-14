const currentJsRuntime$1=function(){return typeof process<"u"&&process.release?.name==="node"?"NODE":typeof window<"u"?"WEB":typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?"WORKER":"NODE"}();if(currentJsRuntime$1==="NODE"){let e=function(r){return new Promise(function(n,s){r.onload=r.onerror=function(i){r.onload=r.onerror=null,i.type==="load"?n(r.result):s(new Error("Failed to read the blob/file"))}})},t=function(){const r=new Uint8Array([1,2,3,4]),s=new File([r],"test").stream();try{return s.getReader({mode:"byob"}),!0}catch{return!1}};if(typeof File>"u"){class r extends Blob{constructor(s,i,o){super(s);let a;o?.lastModified&&(a=new Date),(!a||isNaN(a.getFullYear()))&&(a=new Date),this.lastModifiedDate=a,this.lastModified=a.getMilliseconds(),this.name=i||""}}global.File=r}typeof Blob.prototype.arrayBuffer>"u"&&(Blob.prototype.arrayBuffer=function(){const n=new FileReader;return n.readAsArrayBuffer(this),e(n)}),typeof Blob.prototype.text>"u"&&(Blob.prototype.text=function(){const n=new FileReader;return n.readAsText(this),e(n)}),(typeof Blob.prototype.stream>"u"||!t())&&(Blob.prototype.stream=function(){let r=0;const n=this;return new ReadableStream({type:"bytes",autoAllocateChunkSize:512*1024,async pull(s){const i=s.byobRequest.view,a=await n.slice(r,r+i.byteLength).arrayBuffer(),c=new Uint8Array(a);new Uint8Array(i.buffer).set(c);const l=c.byteLength;s.byobRequest.respond(l),r+=l,r>=n.size&&s.close()}})})}if(currentJsRuntime$1==="NODE"&&typeof CustomEvent>"u"){class e extends Event{constructor(r,n={}){super(r,n),this.detail=n.detail}initCustomEvent(){}}globalThis.CustomEvent=e}const FileErrorCodes={0:"No error occurred. System call completed successfully.",1:"Argument list too long.",2:"Permission denied.",3:"Address in use.",4:"Address not available.",5:"Address family not supported.",6:"Resource unavailable, or operation would block.",7:"Connection already in progress.",8:"Bad file descriptor.",9:"Bad message.",10:"Device or resource busy.",11:"Operation canceled.",12:"No child processes.",13:"Connection aborted.",14:"Connection refused.",15:"Connection reset.",16:"Resource deadlock would occur.",17:"Destination address required.",18:"Mathematics argument out of domain of function.",19:"Reserved.",20:"File exists.",21:"Bad address.",22:"File too large.",23:"Host is unreachable.",24:"Identifier removed.",25:"Illegal byte sequence.",26:"Operation in progress.",27:"Interrupted function.",28:"Invalid argument.",29:"I/O error.",30:"Socket is connected.",31:"There is a directory under that path.",32:"Too many levels of symbolic links.",33:"File descriptor value too large.",34:"Too many links.",35:"Message too large.",36:"Reserved.",37:"Filename too long.",38:"Network is down.",39:"Connection aborted by network.",40:"Network unreachable.",41:"Too many files open in system.",42:"No buffer space available.",43:"No such device.",44:"There is no such file or directory OR the parent directory does not exist.",45:"Executable file format error.",46:"No locks available.",47:"Reserved.",48:"Not enough space.",49:"No message of the desired type.",50:"Protocol not available.",51:"No space left on device.",52:"Function not supported.",53:"The socket is not connected.",54:"Not a directory or a symbolic link to a directory.",55:"Directory not empty.",56:"State not recoverable.",57:"Not a socket.",58:"Not supported, or operation not supported on socket.",59:"Inappropriate I/O control operation.",60:"No such device or address.",61:"Value too large to be stored in data type.",62:"Previous owner died.",63:"Operation not permitted.",64:"Broken pipe.",65:"Protocol error.",66:"Protocol not supported.",67:"Protocol wrong type for socket.",68:"Result too large.",69:"Read-only file system.",70:"Invalid seek.",71:"No such process.",72:"Reserved.",73:"Connection timed out.",74:"Text file busy.",75:"Cross-device link.",76:"Extension: Capabilities insufficient."};function getEmscriptenFsError(e){const t=typeof e=="object"?e?.errno:null;if(t in FileErrorCodes)return FileErrorCodes[t]}function rethrowFileSystemError(e=""){return function(r,n,s){const i=s.value;s.value=function(...o){try{return i.apply(this,o)}catch(a){const c=typeof a=="object"?a?.errno:null;if(c in FileErrorCodes){const l=FileErrorCodes[c],u=typeof o[1]=="string"?o[1]:null,d=u!==null?e.replaceAll("{path}",u):e;throw new Error(`${d}: ${l}`,{cause:a})}throw a}}}}const logEventType="playground-log",logEvent=(e,...t)=>{logger.dispatchEvent(new CustomEvent(logEventType,{detail:{log:e,args:t}}))},logToConsole=(e,...t)=>{switch(typeof e.message=="string"?e.message=prepareLogMessage(e.message):e.message.message&&typeof e.message.message=="string"&&(e.message.message=prepareLogMessage(e.message.message)),e.severity){case"Debug":console.debug(e.message,...t);break;case"Info":console.info(e.message,...t);break;case"Warn":console.warn(e.message,...t);break;case"Error":console.error(e.message,...t);break;case"Fatal":console.error(e.message,...t);break;default:console.log(e.message,...t)}},prepareLogMessage$1=e=>e instanceof Error?[e.message,e.stack].join(`
`):JSON.stringify(e,null,2),logs=[],addToLogArray=e=>{logs.push(e)},logToMemory=e=>{if(e.raw===!0)addToLogArray(e.message);else{const t=formatLogEntry(typeof e.message=="object"?prepareLogMessage$1(e.message):e.message,e.severity??"Info",e.prefix??"JavaScript");addToLogArray(t)}};class Logger extends EventTarget{constructor(t=[]){super(),this.handlers=t,this.fatalErrorEvent="playground-fatal-error"}getLogs(){return this.handlers.includes(logToMemory)?[...logs]:(this.error(`Logs aren't stored because the logToMemory handler isn't registered.
				If you're using a custom logger instance, make sure to register logToMemory handler.
			`),[])}logMessage(t,...r){for(const n of this.handlers)n(t,...r)}log(t,...r){this.logMessage({message:t,severity:void 0,prefix:"JavaScript",raw:!1},...r)}debug(t,...r){this.logMessage({message:t,severity:"Debug",prefix:"JavaScript",raw:!1},...r)}info(t,...r){this.logMessage({message:t,severity:"Info",prefix:"JavaScript",raw:!1},...r)}warn(t,...r){this.logMessage({message:t,severity:"Warn",prefix:"JavaScript",raw:!1},...r)}error(t,...r){this.logMessage({message:t,severity:"Error",prefix:"JavaScript",raw:!1},...r)}}const getDefaultHandlers=()=>{try{if(process.env.NODE_ENV==="test")return[logToMemory,logEvent]}catch{}return[logToMemory,logToConsole,logEvent]},logger=new Logger(getDefaultHandlers()),prepareLogMessage=e=>e.replace(/\t/g,""),formatLogEntry=(e,t,r)=>{const n=new Date,s=new Intl.DateTimeFormat("en-GB",{year:"numeric",month:"short",day:"2-digit",timeZone:"UTC"}).format(n).replace(/ /g,"-"),i=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!1,timeZone:"UTC",timeZoneName:"short"}).format(n),o=s+" "+i;return e=prepareLogMessage(e),`[${o}] ${r} ${t}: ${e}`},SleepFinished=Symbol("SleepFinished");function sleep(e){return new Promise(t=>{setTimeout(()=>t(SleepFinished),e)})}class AcquireTimeoutError extends Error{constructor(){super("Acquiring lock timed out")}}class Semaphore{constructor({concurrency:t,timeout:r}){this._running=0,this.concurrency=t,this.timeout=r,this.queue=[]}get remaining(){return this.concurrency-this.running}get running(){return this._running}async acquire(){for(;;)if(this._running>=this.concurrency){const t=new Promise(r=>{this.queue.push(r)});this.timeout!==void 0?await Promise.race([t,sleep(this.timeout)]).then(r=>{if(r===SleepFinished)throw new AcquireTimeoutError}):await t}else{this._running++;let t=!1;return()=>{t||(t=!0,this._running--,this.queue.length>0&&this.queue.shift()())}}}async run(t){const r=await this.acquire();try{return await t()}finally{r()}}}function joinPaths(...e){let t=e.join("/");const r=t[0]==="/",n=t.substring(t.length-1)==="/";return t=normalizePath$1(t),!t&&!r&&(t="."),t&&n&&(t+="/"),t}function dirname(e){if(e==="/")return"/";e=normalizePath$1(e);const t=e.lastIndexOf("/");return t===-1?"":t===0?"/":e.substr(0,t)}function basename(e){if(e==="/")return"/";e=normalizePath$1(e);const t=e.lastIndexOf("/");return t===-1?e:e.substr(t+1)}function normalizePath$1(e){const t=e[0]==="/";return e=normalizePathsArray(e.split("/").filter(r=>!!r),!t).join("/"),(t?"/":"")+e.replace(/\/$/,"")}function normalizePathsArray(e,t){let r=0;for(let n=e.length-1;n>=0;n--){const s=e[n];s==="."?e.splice(n,1):s===".."?(e.splice(n,1),r++):r&&(e.splice(n,1),r--)}if(t)for(;r;r--)e.unshift("..");return e}function splitShellCommand(e){let n=0,s="";const i=[];let o="";for(let a=0;a<e.length;a++){const c=e[a];c==="\\"?((e[a+1]==='"'||e[a+1]==="'")&&a++,o+=e[a]):n===0?c==='"'||c==="'"?(n=1,s=c):c.match(/\s/)?(o.trim().length&&i.push(o.trim()),o=c):i.length&&!o?o=i.pop()+c:o+=c:n===1&&(c===s?(n=0,s=""):o+=c)}return o&&i.push(o.trim()),i}function createSpawnHandler(e){return function(t,r=[],n={}){const s=new ChildProcess,i=new ProcessApi(s);return setTimeout(async()=>{let o=[];if(r.length)o=[t,...r];else if(typeof t=="string")o=splitShellCommand(t);else if(Array.isArray(t))o=t;else throw new Error("Invalid command ",t);try{await e(o,i,n)}catch(a){s.emit("error",a),typeof a=="object"&&a!==null&&"message"in a&&typeof a.message=="string"&&i.stderr(a.message),i.exit(1)}s.emit("spawn",!0)}),s}}class EventEmitter{constructor(){this.listeners={}}emit(t,r){this.listeners[t]&&this.listeners[t].forEach(function(n){n(r)})}on(t,r){this.listeners[t]||(this.listeners[t]=[]),this.listeners[t].push(r)}}class ProcessApi extends EventEmitter{constructor(t){super(),this.childProcess=t,this.exited=!1,this.stdinData=[],t.on("stdin",r=>{this.stdinData?this.stdinData.push(r.slice()):this.emit("stdin",r)})}stdout(t){typeof t=="string"&&(t=new TextEncoder().encode(t)),this.childProcess.stdout.emit("data",t)}stdoutEnd(){this.childProcess.stdout.emit("end",{})}stderr(t){typeof t=="string"&&(t=new TextEncoder().encode(t)),this.childProcess.stderr.emit("data",t)}stderrEnd(){this.childProcess.stderr.emit("end",{})}exit(t){this.exited||(this.exited=!0,this.childProcess.emit("exit",t))}flushStdin(){if(this.stdinData)for(let t=0;t<this.stdinData.length;t++)this.emit("stdin",this.stdinData[t]);this.stdinData=null}}let lastPid=9743;class ChildProcess extends EventEmitter{constructor(t=lastPid++){super(),this.pid=t,this.stdout=new EventEmitter,this.stderr=new EventEmitter;const r=this;this.stdin={write:n=>{r.emit("stdin",n)}}}}function randomString(e=36,t="!@#$%^&*()_+=-[]/.,<>?"){const r="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"+t;let n="";for(let s=e;s>0;--s)n+=r[Math.floor(Math.random()*r.length)];return n}function phpVar(e){return`json_decode(base64_decode('${stringToBase64(JSON.stringify(e))}'), true)`}function phpVars(e){const t={};for(const r in e)t[r]=phpVar(e[r]);return t}function stringToBase64(e){return bytesToBase64(new TextEncoder().encode(e))}function bytesToBase64(e){const t=String.fromCodePoint(...e);return btoa(t)}var __defProp=Object.defineProperty,__getOwnPropDesc=Object.getOwnPropertyDescriptor,__decorateClass=(e,t,r,n)=>{for(var s=n>1?void 0:n?__getOwnPropDesc(t,r):t,i=e.length-1,o;i>=0;i--)(o=e[i])&&(s=(n?o(t,r,s):o(s))||s);return n&&s&&__defProp(t,r,s),s};const _FSHelpers=class h{static readFileAsText(t,r){return new TextDecoder().decode(h.readFileAsBuffer(t,r))}static readFileAsBuffer(t,r){return t.readFile(r)}static writeFile(t,r,n){t.writeFile(r,n)}static unlink(t,r){t.unlink(r)}static mv(t,r,n){try{const s=t.lookupPath(r).node.mount,i=h.fileExists(t,n)?t.lookupPath(n).node.mount:t.lookupPath(dirname(n)).node.mount;s.mountpoint!==i.mountpoint?(h.copyRecursive(t,r,n),h.rmdir(t,r,{recursive:!0})):t.rename(r,n)}catch(s){const i=getEmscriptenFsError(s);throw i?new Error(`Could not move ${r} to ${n}: ${i}`,{cause:s}):s}}static rmdir(t,r,n={recursive:!0}){n?.recursive&&h.listFiles(t,r).forEach(s=>{const i=`${r}/${s}`;h.isDir(t,i)?h.rmdir(t,i,n):h.unlink(t,i)}),t.rmdir(r)}static listFiles(t,r,n={prependPath:!1}){if(!h.fileExists(t,r))return[];try{const s=t.readdir(r).filter(i=>i!=="."&&i!=="..");if(n.prependPath){const i=r.replace(/\/$/,"");return s.map(o=>`${i}/${o}`)}return s}catch(s){return logger.error(s,{path:r}),[]}}static isDir(t,r){return h.fileExists(t,r)?t.isDir(t.lookupPath(r).node.mode):!1}static fileExists(t,r){try{return t.lookupPath(r),!0}catch{return!1}}static mkdir(t,r){t.mkdirTree(r)}static copyRecursive(t,r,n){const s=t.lookupPath(r).node;if(t.isDir(s.mode)){t.mkdirTree(n);const i=t.readdir(r).filter(o=>o!=="."&&o!=="..");for(const o of i)h.copyRecursive(t,joinPaths(r,o),joinPaths(n,o))}else t.writeFile(n,t.readFile(r))}};__decorateClass([rethrowFileSystemError('Could not read "{path}"')],_FSHelpers,"readFileAsText",1);__decorateClass([rethrowFileSystemError('Could not read "{path}"')],_FSHelpers,"readFileAsBuffer",1);__decorateClass([rethrowFileSystemError('Could not write to "{path}"')],_FSHelpers,"writeFile",1);__decorateClass([rethrowFileSystemError('Could not unlink "{path}"')],_FSHelpers,"unlink",1);__decorateClass([rethrowFileSystemError('Could not remove directory "{path}"')],_FSHelpers,"rmdir",1);__decorateClass([rethrowFileSystemError('Could not list files in "{path}"')],_FSHelpers,"listFiles",1);__decorateClass([rethrowFileSystemError('Could not stat "{path}"')],_FSHelpers,"isDir",1);__decorateClass([rethrowFileSystemError('Could not stat "{path}"')],_FSHelpers,"fileExists",1);__decorateClass([rethrowFileSystemError('Could not create directory "{path}"')],_FSHelpers,"mkdir",1);__decorateClass([rethrowFileSystemError('Could not copy files from "{path}"')],_FSHelpers,"copyRecursive",1);let FSHelpers=_FSHelpers;const _private=new WeakMap;class PHPWorker{constructor(t,r){this.absoluteUrl="",this.documentRoot="",_private.set(this,{monitor:r}),t&&this.__internal_setRequestHandler(t)}__internal_setRequestHandler(t){this.absoluteUrl=t.absoluteUrl,this.documentRoot=t.documentRoot,_private.set(this,{..._private.get(this),requestHandler:t})}__internal_getPHP(){return _private.get(this).php}async setPrimaryPHP(t){_private.set(this,{..._private.get(this),php:t})}pathToInternalUrl(t){return _private.get(this).requestHandler.pathToInternalUrl(t)}internalUrlToPath(t){return _private.get(this).requestHandler.internalUrlToPath(t)}async onDownloadProgress(t){return _private.get(this).monitor?.addEventListener("progress",t)}async mv(t,r){return _private.get(this).php.mv(t,r)}async rmdir(t,r){return _private.get(this).php.rmdir(t,r)}async request(t){return await _private.get(this).requestHandler.request(t)}async run(t){const{php:r,reap:n}=await _private.get(this).requestHandler.processManager.acquirePHPInstance();try{return await r.run(t)}finally{n()}}chdir(t){return _private.get(this).php.chdir(t)}setSapiName(t){_private.get(this).php.setSapiName(t)}mkdir(t){return _private.get(this).php.mkdir(t)}mkdirTree(t){return _private.get(this).php.mkdirTree(t)}readFileAsText(t){return _private.get(this).php.readFileAsText(t)}readFileAsBuffer(t){return _private.get(this).php.readFileAsBuffer(t)}writeFile(t,r){return _private.get(this).php.writeFile(t,r)}unlink(t){return _private.get(this).php.unlink(t)}listFiles(t,r){return _private.get(this).php.listFiles(t,r)}isDir(t){return _private.get(this).php.isDir(t)}fileExists(t){return _private.get(this).php.fileExists(t)}onMessage(t){_private.get(this).php.onMessage(t)}defineConstant(t,r){_private.get(this).php.defineConstant(t,r)}addEventListener(t,r){_private.get(this).php.addEventListener(t,r)}removeEventListener(t,r){_private.get(this).php.removeEventListener(t,r)}}const responseTexts={500:"Internal Server Error",502:"Bad Gateway",404:"Not Found",403:"Forbidden",401:"Unauthorized",400:"Bad Request",301:"Moved Permanently",302:"Found",307:"Temporary Redirect",308:"Permanent Redirect",204:"No Content",201:"Created",200:"OK"};class PHPResponse{constructor(t,r,n,s="",i=0){this.httpStatusCode=t,this.headers=r,this.bytes=n,this.exitCode=i,this.errors=s}static forHttpCode(t,r=""){return new PHPResponse(t,{},new TextEncoder().encode(r||responseTexts[t]||""))}static fromRawData(t){return new PHPResponse(t.httpStatusCode,t.headers,t.bytes,t.errors,t.exitCode)}toRawData(){return{headers:this.headers,bytes:this.bytes,errors:this.errors,exitCode:this.exitCode,httpStatusCode:this.httpStatusCode}}get json(){return JSON.parse(this.text)}get text(){return new TextDecoder().decode(this.bytes)}}const RuntimeId=Symbol("RuntimeId"),loadedRuntimes=new Map;let lastRuntimeId=0;async function loadPHPRuntime(e,t={}){const[r,n,s]=makePromise(),i=e.init(currentJsRuntime,{onAbort(a){s(a),logger.error(a)},ENV:{},locateFile:a=>a,...t,noInitialRun:!0,onRuntimeInitialized(){t.onRuntimeInitialized&&t.onRuntimeInitialized(),n()}});await r;const o=++lastRuntimeId;return i.id=o,i.originalExit=i._exit,i._exit=function(a){return loadedRuntimes.delete(o),i.originalExit(a)},i[RuntimeId]=o,loadedRuntimes.set(o,i),o}function getLoadedRuntime(e){return loadedRuntimes.get(e)}const currentJsRuntime=function(){return typeof process<"u"&&process.release?.name==="node"?"NODE":typeof window<"u"?"WEB":typeof WorkerGlobalScope<"u"&&self instanceof WorkerGlobalScope?"WORKER":"NODE"}(),makePromise=()=>{const e=[],t=new Promise((r,n)=>{e.push(r,n)});return e.unshift(t),e},kError=Symbol("error"),kMessage=Symbol("message");class ErrorEvent2 extends Event{constructor(t,r={}){super(t),this[kError]=r.error===void 0?null:r.error,this[kMessage]=r.message===void 0?"":r.message}get error(){return this[kError]}get message(){return this[kMessage]}}Object.defineProperty(ErrorEvent2.prototype,"error",{enumerable:!0});Object.defineProperty(ErrorEvent2.prototype,"message",{enumerable:!0});const ErrorEvent=typeof globalThis.ErrorEvent=="function"?globalThis.ErrorEvent:ErrorEvent2;function isExitCodeZero(e){return e instanceof Error?"exitCode"in e&&e?.exitCode===0||e?.name==="ExitStatus"&&"status"in e&&e.status===0:!1}class UnhandledRejectionsTarget extends EventTarget{constructor(){super(...arguments),this.listenersCount=0}addEventListener(t,r){++this.listenersCount,super.addEventListener(t,r)}removeEventListener(t,r){--this.listenersCount,super.removeEventListener(t,r)}hasListeners(){return this.listenersCount>0}}function improveWASMErrorReporting(e){const t=new UnhandledRejectionsTarget;for(const r in e.wasmExports)if(typeof e.wasmExports[r]=="function"){const n=e.wasmExports[r];e.wasmExports[r]=function(...s){try{return n(...s)}catch(i){if(!(i instanceof Error))throw i;const o=clarifyErrorMessage(i,e.lastAsyncifyStackSource?.stack);if(e.lastAsyncifyStackSource&&(i.cause=e.lastAsyncifyStackSource),t.hasListeners()){t.dispatchEvent(new ErrorEvent("error",{error:i,message:o}));return}throw isExitCodeZero(i)||showCriticalErrorBox(o),i}}}return t}let functionsMaybeMissingFromAsyncify=[];function getFunctionsMaybeMissingFromAsyncify(){return functionsMaybeMissingFromAsyncify}function clarifyErrorMessage(e,t){if(e.message==="unreachable"){let r=UNREACHABLE_ERROR;t||(r+=`

This stack trace is lacking. For a better one initialize 
the PHP runtime with { debug: true }, e.g. PHPNode.load('8.1', { debug: true }).

`),functionsMaybeMissingFromAsyncify=extractPHPFunctionsFromStack(t||e.stack||"");for(const n of functionsMaybeMissingFromAsyncify)r+=`    * ${n}
`;return r}return e.message}const UNREACHABLE_ERROR=`
"unreachable" WASM instruction executed.

The typical reason is a PHP function missing from the ASYNCIFY_ONLY
list when building PHP.wasm.

You will need to file a new issue in the WordPress Playground repository
and paste this error message there:

https://github.com/WordPress/wordpress-playground/issues/new

If you're a core developer, the typical fix is to:

* Isolate a minimal reproduction of the error
* Add a reproduction of the error to php-asyncify.spec.ts in the WordPress Playground repository
* Run 'npm run fix-asyncify'
* Commit the changes, push to the repo, release updated NPM packages

Below is a list of all the PHP functions found in the stack trace to
help with the minimal reproduction. If they're all already listed in
the Dockerfile, you'll need to trigger this error again with long stack
traces enabled. In node.js, you can do it using the --stack-trace-limit=100
CLI option: 

`,redBg="\x1B[41m",bold="\x1B[1m",reset="\x1B[0m",eol="\x1B[K";let logged=!1;function showCriticalErrorBox(e){if(!logged&&(logged=!0,!e?.trim().startsWith("Program terminated with exit"))){logger.log(`${redBg}
${eol}
${bold}  WASM ERROR${reset}${redBg}`);for(const t of e.split(`
`))logger.log(`${eol}  ${t} `);logger.log(`${reset}`)}}function extractPHPFunctionsFromStack(e){try{const t=e.split(`
`).slice(1).map(r=>{const n=r.trim().substring(3).split(" ");return{fn:n.length>=2?n[0]:"<unknown>",isWasm:r.includes("wasm://")}}).filter(({fn:r,isWasm:n})=>n&&!r.startsWith("dynCall_")&&!r.startsWith("invoke_")).map(({fn:r})=>r);return Array.from(new Set(t))}catch{return[]}}const STRING="string",NUMBER="number",__private__dont__use=Symbol("__private__dont__use");class PHPExecutionFailureError extends Error{constructor(t,r,n){super(t),this.response=r,this.source=n}}const PHP_INI_PATH="/internal/shared/php.ini",AUTO_PREPEND_SCRIPT="/internal/shared/auto_prepend_file.php";class PHP{constructor(e){this.#webSapiInitialized=!1,this.#wasmErrorsTarget=null,this.#eventListeners=new Map,this.#messageListeners=[],this.semaphore=new Semaphore({concurrency:1}),e!==void 0&&this.initializeRuntime(e)}#sapiName;#webSapiInitialized;#wasmErrorsTarget;#eventListeners;#messageListeners;addEventListener(e,t){this.#eventListeners.has(e)||this.#eventListeners.set(e,new Set),this.#eventListeners.get(e).add(t)}removeEventListener(e,t){this.#eventListeners.get(e)?.delete(t)}dispatchEvent(e){const t=this.#eventListeners.get(e.type);if(t)for(const r of t)r(e)}onMessage(e){this.#messageListeners.push(e)}async setSpawnHandler(handler){typeof handler=="string"&&(handler=createSpawnHandler(eval(handler))),this[__private__dont__use].spawnProcess=handler}get absoluteUrl(){return this.requestHandler.absoluteUrl}get documentRoot(){return this.requestHandler.documentRoot}pathToInternalUrl(e){return this.requestHandler.pathToInternalUrl(e)}internalUrlToPath(e){return this.requestHandler.internalUrlToPath(e)}initializeRuntime(e){if(this[__private__dont__use])throw new Error("PHP runtime already initialized.");const t=getLoadedRuntime(e);if(!t)throw new Error("Invalid PHP runtime id.");this[__private__dont__use]=t,this[__private__dont__use].ccall("wasm_set_phpini_path",null,["string"],[PHP_INI_PATH]),this.fileExists(PHP_INI_PATH)||this.writeFile(PHP_INI_PATH,["auto_prepend_file="+AUTO_PREPEND_SCRIPT,"memory_limit=256M","ignore_repeated_errors = 1","error_reporting = E_ALL","display_errors = 1","html_errors = 1","display_startup_errors = On","log_errors = 1","always_populate_raw_post_data = -1","upload_max_filesize = 2000M","post_max_size = 2000M","disable_functions = curl_exec,curl_multi_exec","allow_url_fopen = Off","allow_url_include = Off","session.save_path = /home/web_user","implicit_flush = 1","output_buffering = 0","max_execution_time = 0","max_input_time = -1"].join(`
`)),this.fileExists(AUTO_PREPEND_SCRIPT)||this.writeFile(AUTO_PREPEND_SCRIPT,`<?php
				// Define constants set via defineConstant() calls
				if(file_exists('/internal/shared/consts.json')) {
					$consts = json_decode(file_get_contents('/internal/shared/consts.json'), true);
					foreach ($consts as $const => $value) {
						if (!defined($const) && is_scalar($value)) {
							define($const, $value);
						}
					}
				}
				// Preload all the files from /internal/shared/preload
				foreach (glob('/internal/shared/preload/*.php') as $file) {
					require_once $file;
				}
				`),t.onMessage=async r=>{for(const n of this.#messageListeners){const s=await n(r);if(s)return s}return""},this.#wasmErrorsTarget=improveWASMErrorReporting(t),this.dispatchEvent({type:"runtime.initialized"})}async setSapiName(e){if(this[__private__dont__use].ccall("wasm_set_sapi_name",NUMBER,[STRING],[e])!==0)throw new Error("Could not set SAPI name. This can only be done before the PHP WASM module is initialized.Did you already dispatch any requests?");this.#sapiName=e}chdir(e){this[__private__dont__use].FS.chdir(e)}async request(e){if(logger.warn("PHP.request() is deprecated. Please use new PHPRequestHandler() instead."),!this.requestHandler)throw new Error("No request handler available.");return this.requestHandler.request(e)}async run(e){const t=await this.semaphore.acquire();let r;try{if(this.#webSapiInitialized||(this.#initWebRuntime(),this.#webSapiInitialized=!0),e.scriptPath&&!this.fileExists(e.scriptPath))throw new Error(`The script path "${e.scriptPath}" does not exist.`);this.#setRelativeRequestUri(e.relativeUri||""),this.#setRequestMethod(e.method||"GET");const n=normalizeHeaders(e.headers||{}),s=n.host||"example.com:443",i=this.#inferPortFromHostAndProtocol(s,e.protocol||"http");this.#setRequestHost(s),this.#setRequestPort(i),this.#setRequestHeaders(n),e.body&&(r=this.#setRequestBody(e.body)),typeof e.code=="string"?(this.writeFile("/internal/eval.php",e.code),this.#setScriptPath("/internal/eval.php")):this.#setScriptPath(e.scriptPath||"");const o=this.#prepareServerEntries(e.$_SERVER,n,i);for(const l in o)this.#setServerGlobalEntry(l,o[l]);const a=e.env||{};for(const l in a)this.#setEnv(l,a[l]);const c=await this.#handleRequest();if(c.exitCode!==0){logger.warn("PHP.run() output was:",c.text);const l=new PHPExecutionFailureError(`PHP.run() failed with exit code ${c.exitCode} and the following output: `+c.errors,c,"request");throw logger.error(l),l}return c}catch(n){throw this.dispatchEvent({type:"request.error",error:n,source:n.source??"php-wasm"}),n}finally{try{r&&this[__private__dont__use].free(r)}finally{t(),this.dispatchEvent({type:"request.end"})}}}#prepareServerEntries(e,t,r){const n={...e||{}};n.HTTPS=n.HTTPS||r===443?"on":"off";for(const s in t){let i="HTTP_";["content-type","content-length"].includes(s.toLowerCase())&&(i=""),n[`${i}${s.toUpperCase().replace(/-/g,"_")}`]=t[s]}return n}#initWebRuntime(){this[__private__dont__use].ccall("php_wasm_init",null,[],[])}#getResponseHeaders(){const e="/internal/headers.json";if(!this.fileExists(e))throw new Error("SAPI Error: Could not find response headers file.");const t=JSON.parse(this.readFileAsText(e)),r={};for(const n of t.headers){if(!n.includes(": "))continue;const s=n.indexOf(": "),i=n.substring(0,s).toLowerCase(),o=n.substring(s+2);i in r||(r[i]=[]),r[i].push(o)}return{headers:r,httpStatusCode:t.status}}#setRelativeRequestUri(e){if(this[__private__dont__use].ccall("wasm_set_request_uri",null,[STRING],[e]),e.includes("?")){const t=e.substring(e.indexOf("?")+1);this[__private__dont__use].ccall("wasm_set_query_string",null,[STRING],[t])}}#setRequestHost(e){this[__private__dont__use].ccall("wasm_set_request_host",null,[STRING],[e])}#setRequestPort(e){this[__private__dont__use].ccall("wasm_set_request_port",null,[NUMBER],[e])}#inferPortFromHostAndProtocol(e,t){let r;try{r=parseInt(new URL(e).port,10)}catch{}return(!r||isNaN(r)||r===80)&&(r=t==="https"?443:80),r}#setRequestMethod(e){this[__private__dont__use].ccall("wasm_set_request_method",null,[STRING],[e])}#setRequestHeaders(e){e.cookie&&this[__private__dont__use].ccall("wasm_set_cookies",null,[STRING],[e.cookie]),e["content-type"]&&this[__private__dont__use].ccall("wasm_set_content_type",null,[STRING],[e["content-type"]]),e["content-length"]&&this[__private__dont__use].ccall("wasm_set_content_length",null,[NUMBER],[parseInt(e["content-length"],10)])}#setRequestBody(e){let t,r;typeof e=="string"?(logger.warn("Passing a string as the request body is deprecated. Please use a Uint8Array instead. See https://github.com/WordPress/wordpress-playground/issues/997 for more details"),r=this[__private__dont__use].lengthBytesUTF8(e),t=r+1):(r=e.byteLength,t=e.byteLength);const n=this[__private__dont__use].malloc(t);if(!n)throw new Error("Could not allocate memory for the request body.");return typeof e=="string"?this[__private__dont__use].stringToUTF8(e,n,t+1):this[__private__dont__use].HEAPU8.set(e,n),this[__private__dont__use].ccall("wasm_set_request_body",null,[NUMBER],[n]),this[__private__dont__use].ccall("wasm_set_content_length",null,[NUMBER],[r]),n}#setScriptPath(e){this[__private__dont__use].ccall("wasm_set_path_translated",null,[STRING],[e])}#setServerGlobalEntry(e,t){this[__private__dont__use].ccall("wasm_add_SERVER_entry",null,[STRING,STRING],[e,t])}#setEnv(e,t){this[__private__dont__use].ccall("wasm_add_ENV_entry",null,[STRING,STRING],[e,t])}defineConstant(e,t){let r={};try{r=JSON.parse(this.fileExists("/internal/shared/consts.json")&&this.readFileAsText("/internal/shared/consts.json")||"{}")}catch{}this.writeFile("/internal/shared/consts.json",JSON.stringify({...r,[e]:t}))}async#handleRequest(){let e,t;try{e=await new Promise((s,i)=>{t=a=>{logger.error(a),logger.error(a.error);const c=new Error("Rethrown");c.cause=a.error,c.betterMessage=a.message,i(c)},this.#wasmErrorsTarget?.addEventListener("error",t);const o=this[__private__dont__use].ccall("wasm_sapi_handle_request",NUMBER,[],[],{async:!0});return o instanceof Promise?o.then(s,i):s(o)})}catch(s){for(const c in this)typeof this[c]=="function"&&(this[c]=()=>{throw new Error("PHP runtime has crashed – see the earlier error for details.")});this.functionsMaybeMissingFromAsyncify=getFunctionsMaybeMissingFromAsyncify();const i=s,o="betterMessage"in i?i.betterMessage:i.message,a=new Error(o);throw a.cause=i,logger.error(a),a}finally{this.#wasmErrorsTarget?.removeEventListener("error",t)}const{headers:r,httpStatusCode:n}=this.#getResponseHeaders();return new PHPResponse(e===0?n:500,r,this.readFileAsBuffer("/internal/stdout"),this.readFileAsText("/internal/stderr"),e)}mkdir(e){return FSHelpers.mkdir(this[__private__dont__use].FS,e)}mkdirTree(e){return FSHelpers.mkdir(this[__private__dont__use].FS,e)}readFileAsText(e){return FSHelpers.readFileAsText(this[__private__dont__use].FS,e)}readFileAsBuffer(e){return FSHelpers.readFileAsBuffer(this[__private__dont__use].FS,e)}writeFile(e,t){return FSHelpers.writeFile(this[__private__dont__use].FS,e,t)}unlink(e){return FSHelpers.unlink(this[__private__dont__use].FS,e)}mv(e,t){return FSHelpers.mv(this[__private__dont__use].FS,e,t)}rmdir(e,t={recursive:!0}){return FSHelpers.rmdir(this[__private__dont__use].FS,e,t)}listFiles(e,t={prependPath:!1}){return FSHelpers.listFiles(this[__private__dont__use].FS,e,t)}isDir(e){return FSHelpers.isDir(this[__private__dont__use].FS,e)}fileExists(e){return FSHelpers.fileExists(this[__private__dont__use].FS,e)}hotSwapPHPRuntime(e,t){const r=this[__private__dont__use].FS;try{this.exit()}catch{}this.initializeRuntime(e),this.#sapiName&&this.setSapiName(this.#sapiName),t&&copyFS(r,this[__private__dont__use].FS,t)}async mount(e,t){return await t(this,this[__private__dont__use].FS,e)}async cli(e){for(const t of e)this[__private__dont__use].ccall("wasm_add_cli_arg",null,[STRING],[t]);try{return await this[__private__dont__use].ccall("run_cli",null,[],[],{async:!0})}catch(t){if(isExitCodeZero(t))return 0;throw t}}setSkipShebang(e){this[__private__dont__use].ccall("wasm_set_skip_shebang",null,[NUMBER],[e?1:0])}exit(e=0){this.dispatchEvent({type:"runtime.beforedestroy"});try{this[__private__dont__use]._exit(e)}catch{}this.#webSapiInitialized=!1,this.#wasmErrorsTarget=null,delete this[__private__dont__use].onMessage,delete this[__private__dont__use]}[Symbol.dispose](){this.#webSapiInitialized&&this.exit(0)}}function normalizeHeaders(e){const t={};for(const r in e)t[r.toLowerCase()]=e[r];return t}function copyFS(e,t,r){let n;try{n=e.lookupPath(r)}catch{return}if(!("contents"in n.node))return;if(!e.isDir(n.node.mode)){t.writeFile(r,e.readFile(r));return}t.mkdirTree(r);const s=e.readdir(r).filter(i=>i!=="."&&i!=="..");for(const i of s)copyFS(e,t,joinPaths(r,i))}const{hasOwnProperty}=Object.prototype,encode=(e,t={})=>{typeof t=="string"&&(t={section:t}),t.align=t.align===!0,t.newline=t.newline===!0,t.sort=t.sort===!0,t.whitespace=t.whitespace===!0||t.align===!0,t.platform=t.platform||typeof process<"u"&&process.platform,t.bracketedArray=t.bracketedArray!==!1;const r=t.platform==="win32"?`\r
`:`
`,n=t.whitespace?" = ":"=",s=[],i=t.sort?Object.keys(e).sort():Object.keys(e);let o=0;t.align&&(o=safe(i.filter(l=>e[l]===null||Array.isArray(e[l])||typeof e[l]!="object").map(l=>Array.isArray(e[l])?`${l}[]`:l).concat([""]).reduce((l,u)=>safe(l).length>=safe(u).length?l:u)).length);let a="";const c=t.bracketedArray?"[]":"";for(const l of i){const u=e[l];if(u&&Array.isArray(u))for(const d of u)a+=safe(`${l}${c}`).padEnd(o," ")+n+safe(d)+r;else u&&typeof u=="object"?s.push(l):a+=safe(l).padEnd(o," ")+n+safe(u)+r}t.section&&a.length&&(a="["+safe(t.section)+"]"+(t.newline?r+r:r)+a);for(const l of s){const u=splitSections(l,".").join("\\."),d=(t.section?t.section+".":"")+u,p=encode(e[l],{...t,section:d});a.length&&p.length&&(a+=r),a+=p}return a};function splitSections(e,t){var r=0,n=0,s=0,i=[];do if(s=e.indexOf(t,r),s!==-1){if(r=s+t.length,s>0&&e[s-1]==="\\")continue;i.push(e.slice(n,s)),n=s+t.length}while(s!==-1);return i.push(e.slice(n)),i}const decode=(e,t={})=>{t.bracketedArray=t.bracketedArray!==!1;const r=Object.create(null);let n=r,s=null;const i=/^\[([^\]]*)\]\s*$|^([^=]+)(=(.*))?$/i,o=e.split(/[\r\n]+/g),a={};for(const l of o){if(!l||l.match(/^\s*[;#]/)||l.match(/^\s*$/))continue;const u=l.match(i);if(!u)continue;if(u[1]!==void 0){if(s=unsafe(u[1]),s==="__proto__"){n=Object.create(null);continue}n=r[s]=r[s]||Object.create(null);continue}const d=unsafe(u[2]);let p;t.bracketedArray?p=d.length>2&&d.slice(-2)==="[]":(a[d]=(a?.[d]||0)+1,p=a[d]>1);const f=p?d.slice(0,-2):d;if(f==="__proto__")continue;const m=u[3]?unsafe(u[4]):!0,_=m==="true"||m==="false"||m==="null"?JSON.parse(m):m;p&&(hasOwnProperty.call(n,f)?Array.isArray(n[f])||(n[f]=[n[f]]):n[f]=[]),Array.isArray(n[f])?n[f].push(_):n[f]=_}const c=[];for(const l of Object.keys(r)){if(!hasOwnProperty.call(r,l)||typeof r[l]!="object"||Array.isArray(r[l]))continue;const u=splitSections(l,".");n=r;const d=u.pop(),p=d.replace(/\\\./g,".");for(const f of u)f!=="__proto__"&&((!hasOwnProperty.call(n,f)||typeof n[f]!="object")&&(n[f]=Object.create(null)),n=n[f]);n===r&&p===d||(n[p]=r[l],c.push(l))}for(const l of c)delete r[l];return r},isQuoted=e=>e.startsWith('"')&&e.endsWith('"')||e.startsWith("'")&&e.endsWith("'"),safe=e=>typeof e!="string"||e.match(/[=\r\n]/)||e.match(/^\[/)||e.length>1&&isQuoted(e)||e!==e.trim()?JSON.stringify(e):e.split(";").join("\\;").split("#").join("\\#"),unsafe=e=>{if(e=(e||"").trim(),isQuoted(e)){e.charAt(0)==="'"&&(e=e.slice(1,-1));try{e=JSON.parse(e)}catch{}}else{let t=!1,r="";for(let n=0,s=e.length;n<s;n++){const i=e.charAt(n);if(t)"\\;#".indexOf(i)!==-1?r+=i:r+="\\"+i,t=!1;else{if(";#".indexOf(i)!==-1)break;i==="\\"?t=!0:r+=i}}return t&&(r+="\\"),r.trim()}return e};var ini={parse:decode,decode,stringify:encode,encode,safe,unsafe};async function setPhpIniEntries(e,t){const r=ini.parse(await e.readFileAsText(PHP_INI_PATH));for(const[n,s]of Object.entries(t))s==null?delete r[n]:r[n]=s;await e.writeFile(PHP_INI_PATH,ini.stringify(r))}async function withPHPIniValues(e,t,r){const n=await e.readFileAsText(PHP_INI_PATH);try{return await setPhpIniEntries(e,t),await r()}finally{await e.writeFile(PHP_INI_PATH,n)}}class HttpCookieStore{constructor(){this.cookies={}}rememberCookiesFromResponseHeaders(t){if(t?.["set-cookie"])for(const r of t["set-cookie"])try{if(!r.includes("="))continue;const n=r.indexOf("="),s=r.substring(0,n),i=r.substring(n+1).split(";")[0];this.cookies[s]=i}catch(n){logger.error(n)}}getCookieRequestHeader(){const t=[];for(const r in this.cookies)t.push(`${r}=${this.cookies[r]}`);return t.join("; ")}}ReadableStream.prototype[Symbol.asyncIterator]||(ReadableStream.prototype[Symbol.asyncIterator]=async function*(){const e=this.getReader();try{for(;;){const{done:t,value:r}=await e.read();if(t)return;yield r}}finally{e.releaseLock()}},ReadableStream.prototype.iterate=ReadableStream.prototype[Symbol.asyncIterator]);class MaxPhpInstancesError extends Error{constructor(t){super(`Requested more concurrent PHP instances than the limit (${t}).`),this.name=this.constructor.name}}class PHPProcessManager{constructor(t){this.primaryIdle=!0,this.nextInstance=null,this.allInstances=[],this.maxPhpInstances=t?.maxPhpInstances??5,this.phpFactory=t?.phpFactory,this.primaryPhp=t?.primaryPhp,this.semaphore=new Semaphore({concurrency:this.maxPhpInstances,timeout:t?.timeout||5e3})}async getPrimaryPhp(){if(!this.phpFactory&&!this.primaryPhp)throw new Error("phpFactory or primaryPhp must be set before calling getPrimaryPhp().");if(!this.primaryPhp){const t=await this.spawn({isPrimary:!0});this.primaryPhp=t.php}return this.primaryPhp}async acquirePHPInstance(){if(this.primaryIdle)return this.primaryIdle=!1,{php:await this.getPrimaryPhp(),reap:()=>this.primaryIdle=!0};const t=this.nextInstance||this.spawn({isPrimary:!1});return this.semaphore.remaining>0?this.nextInstance=this.spawn({isPrimary:!1}):this.nextInstance=null,await t}spawn(t){if(t.isPrimary&&this.allInstances.length>0)throw new Error("Requested spawning a primary PHP instance when another primary instance already started spawning.");const r=this.doSpawn(t);this.allInstances.push(r);const n=()=>{this.allInstances=this.allInstances.filter(s=>s!==r)};return r.catch(s=>{throw n(),s}).then(s=>({...s,reap:()=>{n(),s.reap()}}))}async doSpawn(t){let r;try{r=await this.semaphore.acquire()}catch(n){throw n instanceof AcquireTimeoutError?new MaxPhpInstancesError(this.maxPhpInstances):n}try{const n=await this.phpFactory(t);return{php:n,reap(){n.exit(),r()}}}catch(n){throw r(),n}}async[Symbol.asyncDispose](){this.primaryPhp&&this.primaryPhp.exit(),await Promise.all(this.allInstances.map(t=>t.then(({reap:r})=>r())))}}const SupportedPHPVersions=["8.3","8.2","8.1","8.0","7.4","7.3","7.2","7.1","7.0"],LatestSupportedPHPVersion=SupportedPHPVersions[0],SupportedPHPVersionsList=SupportedPHPVersions,DEFAULT_BASE_URL="http://example.com";function toRelativeUrl(e){return e.toString().substring(e.origin.length)}function removePathPrefix(e,t){return!t||!e.startsWith(t)?e:e.substring(t.length)}function ensurePathPrefix(e,t){return!t||e.startsWith(t)?e:t+e}async function encodeAsMultipart(e){const t=`----${Math.random().toString(36).slice(2)}`,r=`multipart/form-data; boundary=${t}`,n=new TextEncoder,s=[];for(const[c,l]of Object.entries(e))s.push(`--${t}\r
`),s.push(`Content-Disposition: form-data; name="${c}"`),l instanceof File&&s.push(`; filename="${l.name}"`),s.push(`\r
`),l instanceof File&&(s.push("Content-Type: application/octet-stream"),s.push(`\r
`)),s.push(`\r
`),l instanceof File?s.push(await fileToUint8Array(l)):s.push(l),s.push(`\r
`);s.push(`--${t}--\r
`);const i=s.reduce((c,l)=>c+l.length,0),o=new Uint8Array(i);let a=0;for(const c of s)o.set(typeof c=="string"?n.encode(c):c,a),a+=c.length;return{bytes:o,contentType:r}}function fileToUint8Array(e){return new Promise(t=>{const r=new FileReader;r.onload=()=>{t(new Uint8Array(r.result))},r.readAsArrayBuffer(e)})}const _default="application/octet-stream",asx="video/x-ms-asf",atom="application/atom+xml",avi="video/x-msvideo",avif="image/avif",bin="application/octet-stream",bmp="image/x-ms-bmp",cco="application/x-cocoa",css="text/css",data="application/octet-stream",deb="application/octet-stream",der="application/x-x509-ca-cert",dmg="application/octet-stream",doc="application/msword",docx="application/vnd.openxmlformats-officedocument.wordprocessingml.document",eot="application/vnd.ms-fontobject",flv="video/x-flv",gif="image/gif",gz="application/gzip",hqx="application/mac-binhex40",htc="text/x-component",html="text/html",ico="image/x-icon",iso="application/octet-stream",jad="text/vnd.sun.j2me.app-descriptor",jar="application/java-archive",jardiff="application/x-java-archive-diff",jng="image/x-jng",jnlp="application/x-java-jnlp-file",jpg="image/jpeg",jpeg="image/jpeg",js="application/javascript",json="application/json",kml="application/vnd.google-earth.kml+xml",kmz="application/vnd.google-earth.kmz",m3u8="application/vnd.apple.mpegurl",m4a="audio/x-m4a",m4v="video/x-m4v",md="text/plain",mid="audio/midi",mml="text/mathml",mng="video/x-mng",mov="video/quicktime",mp3="audio/mpeg",mp4="video/mp4",mpeg="video/mpeg",msi="application/octet-stream",odg="application/vnd.oasis.opendocument.graphics",odp="application/vnd.oasis.opendocument.presentation",ods="application/vnd.oasis.opendocument.spreadsheet",odt="application/vnd.oasis.opendocument.text",ogg="audio/ogg",otf="font/otf",pdf="application/pdf",pl="application/x-perl",png="image/png",ppt="application/vnd.ms-powerpoint",pptx="application/vnd.openxmlformats-officedocument.presentationml.presentation",prc="application/x-pilot",ps="application/postscript",ra="audio/x-realaudio",rar="application/x-rar-compressed",rpm="application/x-redhat-package-manager",rss="application/rss+xml",rtf="application/rtf",run="application/x-makeself",sea="application/x-sea",sit="application/x-stuffit",svg="image/svg+xml",swf="application/x-shockwave-flash",tcl="application/x-tcl",tar="application/x-tar",tif="image/tiff",ts="video/mp2t",ttf="font/ttf",txt="text/plain",wasm="application/wasm",wbmp="image/vnd.wap.wbmp",webm="video/webm",webp="image/webp",wml="text/vnd.wap.wml",wmlc="application/vnd.wap.wmlc",wmv="video/x-ms-wmv",woff="font/woff",woff2="font/woff2",xhtml="application/xhtml+xml",xls="application/vnd.ms-excel",xlsx="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",xml="text/xml",xpi="application/x-xpinstall",xspf="application/xspf+xml",zip="application/zip";var mimeTypes={_default,"3gpp":"video/3gpp","7z":"application/x-7z-compressed",asx,atom,avi,avif,bin,bmp,cco,css,data,deb,der,dmg,doc,docx,eot,flv,gif,gz,hqx,htc,html,ico,iso,jad,jar,jardiff,jng,jnlp,jpg,jpeg,js,json,kml,kmz,m3u8,m4a,m4v,md,mid,mml,mng,mov,mp3,mp4,mpeg,msi,odg,odp,ods,odt,ogg,otf,pdf,pl,png,ppt,pptx,prc,ps,ra,rar,rpm,rss,rtf,run,sea,sit,svg,swf,tcl,tar,tif,ts,ttf,txt,wasm,wbmp,webm,webp,wml,wmlc,wmv,woff,woff2,xhtml,xls,xlsx,xml,xpi,xspf,zip};class PHPRequestHandler{#e;#t;#n;#s;#i;#r;#o;#a;constructor(t){const{documentRoot:r="/www/",absoluteUrl:n=typeof location=="object"?location?.href:"",rewriteRules:s=[]}=t;"processManager"in t?this.processManager=t.processManager:this.processManager=new PHPProcessManager({phpFactory:async a=>{const c=await t.phpFactory({...a,requestHandler:this});return c.requestHandler=this,c},maxPhpInstances:t.maxPhpInstances}),this.#a=new HttpCookieStore,this.#e=r;const i=new URL(n);this.#n=i.hostname,this.#s=i.port?Number(i.port):i.protocol==="https:"?443:80,this.#t=(i.protocol||"").replace(":","");const o=this.#s!==443&&this.#s!==80;this.#i=[this.#n,o?`:${this.#s}`:""].join(""),this.#r=i.pathname.replace(/\/+$/,""),this.#o=[`${this.#t}://`,this.#i,this.#r].join(""),this.rewriteRules=s}async getPrimaryPhp(){return await this.processManager.getPrimaryPhp()}pathToInternalUrl(t){return`${this.absoluteUrl}${t}`}internalUrlToPath(t){const r=new URL(t);return r.pathname.startsWith(this.#r)&&(r.pathname=r.pathname.slice(this.#r.length)),toRelativeUrl(r)}get absoluteUrl(){return this.#o}get documentRoot(){return this.#e}async request(t){const r=t.url.startsWith("http://")||t.url.startsWith("https://"),n=new URL(t.url.split("#")[0],r?void 0:DEFAULT_BASE_URL),s=applyRewriteRules(removePathPrefix(decodeURIComponent(n.pathname),this.#r),this.rewriteRules),i=joinPaths(this.#e,s);return seemsLikeAPHPRequestHandlerPath(i)?this.#c(t,n):this.#l(await this.processManager.getPrimaryPhp(),i)}#l(t,r){if(!t.fileExists(r))return new PHPResponse(404,{"x-file-type":["static"]},new TextEncoder().encode("404 File not found"));const n=t.readFileAsBuffer(r);return new PHPResponse(200,{"content-length":[`${n.byteLength}`],"content-type":[inferMimeType(r)],"accept-ranges":["bytes"],"cache-control":["public, max-age=0"]},n)}async#c(t,r){let n;try{n=await this.processManager.acquirePHPInstance()}catch(s){return s instanceof MaxPhpInstancesError?PHPResponse.forHttpCode(502):PHPResponse.forHttpCode(500)}try{return await this.#u(n.php,t,r)}finally{n.reap()}}async#u(t,r,n){let s="GET";const i={host:this.#i,...normalizeHeaders(r.headers||{}),cookie:this.#a.getCookieRequestHeader()};let o=r.body;if(typeof o=="object"&&!(o instanceof Uint8Array)){s="POST";const{bytes:c,contentType:l}=await encodeAsMultipart(o);o=c,i["content-type"]=l}let a;try{a=this.#d(t,decodeURIComponent(n.pathname))}catch{return PHPResponse.forHttpCode(404)}try{const c=await t.run({relativeUri:ensurePathPrefix(toRelativeUrl(n),this.#r),protocol:this.#t,method:r.method||s,$_SERVER:{REMOTE_ADDR:"127.0.0.1",DOCUMENT_ROOT:this.#e,HTTPS:this.#o.startsWith("https://")?"on":""},body:o,scriptPath:a,headers:i});return this.#a.rememberCookiesFromResponseHeaders(c.headers),c}catch(c){const l=c;if(l?.response)return l.response;throw c}}#d(t,r){let n=removePathPrefix(r,this.#r);n=applyRewriteRules(n,this.rewriteRules),n.includes(".php")?n=n.split(".php")[0]+".php":t.isDir(`${this.#e}${n}`)?(n.endsWith("/")||(n=`${n}/`),n=`${n}index.php`):n="/index.php";let s=`${this.#e}${n}`;if(t.fileExists(s)||(s=`${this.#e}/index.php`),t.fileExists(s))return s;throw new Error(`File not found: ${s}`)}}function inferMimeType(e){const t=e.split(".").pop();return mimeTypes[t]||mimeTypes._default}function seemsLikeAPHPRequestHandlerPath(e){return seemsLikeAPHPFile(e)||seemsLikeADirectoryRoot(e)}function seemsLikeAPHPFile(e){return e.endsWith(".php")||e.includes(".php/")}function seemsLikeADirectoryRoot(e){return!e.split("/").pop().includes(".")}function applyRewriteRules(e,t){for(const r of t)if(new RegExp(r.match).test(e))return e.replace(r.match,r.replacement);return e}function rotatePHPRuntime({php:e,cwd:t,recreateRuntime:r,maxRequests:n=400}){let s=0;async function i(){if(++s<n)return;s=0;const o=await e.semaphore.acquire();try{e.hotSwapPHPRuntime(await r(),t)}finally{o()}}return e.addEventListener("request.end",i),function(){e.removeEventListener("request.end",i)}}async function writeFiles(e,t,r,{rmRoot:n=!1}={}){n&&await e.isDir(t)&&await e.rmdir(t,{recursive:!0});for(const[s,i]of Object.entries(r)){const o=joinPaths(t,s);await e.fileExists(dirname(o))||await e.mkdir(dirname(o)),i instanceof Uint8Array||typeof i=="string"?await e.writeFile(o,i):await writeFiles(e,o,i)}}function proxyFileSystem(e,t,r){const n=Object.getOwnPropertySymbols(e)[0];for(const s of r)t.fileExists(s)||t.mkdir(s),e.fileExists(s)||e.mkdir(s),t[n].FS.mount(t[n].PROXYFS,{root:s,fs:e[n].FS},s)}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const proxyMarker=Symbol("Comlink.proxy"),createEndpoint=Symbol("Comlink.endpoint"),releaseProxy=Symbol("Comlink.releaseProxy"),finalizer=Symbol("Comlink.finalizer"),throwMarker=Symbol("Comlink.thrown"),isObject=e=>typeof e=="object"&&e!==null||typeof e=="function",proxyTransferHandler={canHandle:e=>isObject(e)&&e[proxyMarker],serialize(e){const{port1:t,port2:r}=new MessageChannel;return expose(e,t),[r,[r]]},deserialize(e){return e.start(),wrap(e)}},throwTransferHandler={canHandle:e=>isObject(e)&&throwMarker in e,serialize({value:e}){let t;return e instanceof Error?t={isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:t={isError:!1,value:e},[t,[]]},deserialize(e){throw e.isError?Object.assign(new Error(e.value.message),e.value):e.value}},transferHandlers=new Map([["proxy",proxyTransferHandler],["throw",throwTransferHandler]]);function isAllowedOrigin(e,t){for(const r of e)if(t===r||r==="*"||r instanceof RegExp&&r.test(t))return!0;return!1}function expose(e,t=globalThis,r=["*"]){t.addEventListener("message",function n(s){if(!s||!s.data)return;if(!isAllowedOrigin(r,s.origin)){console.warn(`Invalid origin '${s.origin}' for comlink proxy`);return}const{id:i,type:o,path:a}=Object.assign({path:[]},s.data),c=(s.data.argumentList||[]).map(fromWireValue);let l;try{const u=a.slice(0,-1).reduce((p,f)=>p[f],e),d=a.reduce((p,f)=>p[f],e);switch(o){case"GET":l=d;break;case"SET":u[a.slice(-1)[0]]=fromWireValue(s.data.value),l=!0;break;case"APPLY":l=d.apply(u,c);break;case"CONSTRUCT":{const p=new d(...c);l=proxy(p)}break;case"ENDPOINT":{const{port1:p,port2:f}=new MessageChannel;expose(e,f),l=transfer(p,[p])}break;case"RELEASE":l=void 0;break;default:return}}catch(u){l={value:u,[throwMarker]:0}}Promise.resolve(l).catch(u=>({value:u,[throwMarker]:0})).then(u=>{const[d,p]=toWireValue(u);t.postMessage(Object.assign(Object.assign({},d),{id:i}),p),o==="RELEASE"&&(t.removeEventListener("message",n),closeEndPoint(t),finalizer in e&&typeof e[finalizer]=="function"&&e[finalizer]())}).catch(u=>{const[d,p]=toWireValue({value:new TypeError("Unserializable return value"),[throwMarker]:0});t.postMessage(Object.assign(Object.assign({},d),{id:i}),p)})}),t.start&&t.start()}function isMessagePort(e){return e.constructor.name==="MessagePort"}function closeEndPoint(e){isMessagePort(e)&&e.close()}function wrap(e,t){return createProxy(e,[],t)}function throwIfProxyReleased(e){if(e)throw new Error("Proxy has been released and is not useable")}function releaseEndpoint(e){return requestResponseMessage(e,{type:"RELEASE"}).then(()=>{closeEndPoint(e)})}const proxyCounter=new WeakMap,proxyFinalizers="FinalizationRegistry"in globalThis&&new FinalizationRegistry(e=>{const t=(proxyCounter.get(e)||0)-1;proxyCounter.set(e,t),t===0&&releaseEndpoint(e)});function registerProxy(e,t){const r=(proxyCounter.get(t)||0)+1;proxyCounter.set(t,r),proxyFinalizers&&proxyFinalizers.register(e,t,e)}function unregisterProxy(e){proxyFinalizers&&proxyFinalizers.unregister(e)}function createProxy(e,t=[],r=function(){}){let n=!1;const s=new Proxy(r,{get(i,o){if(throwIfProxyReleased(n),o===releaseProxy)return()=>{unregisterProxy(s),releaseEndpoint(e),n=!0};if(o==="then"){if(t.length===0)return{then:()=>s};const a=requestResponseMessage(e,{type:"GET",path:t.map(c=>c.toString())}).then(fromWireValue);return a.then.bind(a)}return createProxy(e,[...t,o])},set(i,o,a){throwIfProxyReleased(n);const[c,l]=toWireValue(a);return requestResponseMessage(e,{type:"SET",path:[...t,o].map(u=>u.toString()),value:c},l).then(fromWireValue)},apply(i,o,a){throwIfProxyReleased(n);const c=t[t.length-1];if(c===createEndpoint)return requestResponseMessage(e,{type:"ENDPOINT"}).then(fromWireValue);if(c==="bind")return createProxy(e,t.slice(0,-1));const[l,u]=processArguments(a);return requestResponseMessage(e,{type:"APPLY",path:t.map(d=>d.toString()),argumentList:l},u).then(fromWireValue)},construct(i,o){throwIfProxyReleased(n);const[a,c]=processArguments(o);return requestResponseMessage(e,{type:"CONSTRUCT",path:t.map(l=>l.toString()),argumentList:a},c).then(fromWireValue)}});return registerProxy(s,e),s}function myFlat(e){return Array.prototype.concat.apply([],e)}function processArguments(e){const t=e.map(toWireValue);return[t.map(r=>r[0]),myFlat(t.map(r=>r[1]))]}const transferCache=new WeakMap;function transfer(e,t){return transferCache.set(e,t),e}function proxy(e){return Object.assign(e,{[proxyMarker]:!0})}function windowEndpoint(e,t=globalThis,r="*"){return{postMessage:(n,s)=>e.postMessage(n,r,s),addEventListener:t.addEventListener.bind(t),removeEventListener:t.removeEventListener.bind(t)}}function toWireValue(e){for(const[t,r]of transferHandlers)if(r.canHandle(e)){const[n,s]=r.serialize(e);return[{type:"HANDLER",name:t,value:n},s]}return[{type:"RAW",value:e},transferCache.get(e)||[]]}function fromWireValue(e){switch(e.type){case"HANDLER":return transferHandlers.get(e.name).deserialize(e.value);case"RAW":return e.value}}function requestResponseMessage(e,t,r){return new Promise(n=>{const s=generateUUID();e.addEventListener("message",function i(o){!o.data||!o.data.id||o.data.id!==s||(e.removeEventListener("message",i),n(o.data))}),e.start&&e.start(),e.postMessage(Object.assign({id:s},t),r)})}function generateUUID(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}function exposeAPI(e,t){setupTransferHandlers();const r=Promise.resolve();let n,s;const i=new Promise((c,l)=>{n=c,s=l}),o=proxyClone(e),a=new Proxy(o,{get:(c,l)=>l==="isConnected"?()=>r:l==="isReady"?()=>i:l in c?c[l]:t?.[l]});return expose(a,typeof window<"u"?windowEndpoint(self.parent):void 0),[n,s,a]}let isTransferHandlersSetup=!1;function setupTransferHandlers(){if(isTransferHandlersSetup)return;isTransferHandlersSetup=!0,transferHandlers.set("EVENT",{canHandle:r=>r instanceof CustomEvent,serialize:r=>[{detail:r.detail},[]],deserialize:r=>r}),transferHandlers.set("FUNCTION",{canHandle:r=>typeof r=="function",serialize(r){const{port1:n,port2:s}=new MessageChannel;return expose(r,n),[s,[s]]},deserialize(r){return r.start(),wrap(r)}}),transferHandlers.set("PHPResponse",{canHandle:r=>typeof r=="object"&&r!==null&&"headers"in r&&"bytes"in r&&"errors"in r&&"exitCode"in r&&"httpStatusCode"in r,serialize(r){return[r.toRawData(),[]]},deserialize(r){return PHPResponse.fromRawData(r)}});const e=transferHandlers.get("throw"),t=e?.serialize;e.serialize=({value:r})=>{const n=t({value:r});return r.response&&(n[0].value.response=r.response),r.source&&(n[0].value.source=r.source),n}}function proxyClone(e){return new Proxy(e,{get(t,r){switch(typeof t[r]){case"function":return(...n)=>t[r](...n);case"object":return t[r]===null?t[r]:proxyClone(t[r]);case"undefined":case"number":case"string":return t[r];default:return proxy(t[r])}}})}async function getPHPLoaderModule(e=LatestSupportedPHPVersion,t="light"){if(t==="kitchen-sink")switch(e){case"8.3":return await import("./assets/php_8_3-f7e09348.js");case"8.2":return await import("./assets/php_8_2-2897f82e.js");case"8.1":return await import("./assets/php_8_1-c2825d09.js");case"8.0":return await import("./assets/php_8_0-a8925787.js");case"7.4":return await import("./assets/php_7_4-b46955e0.js");case"7.3":return await import("./assets/php_7_3-539e1304.js");case"7.2":return await import("./assets/php_7_2-ad53ca5a.js");case"7.1":return await import("./assets/php_7_1-9b17981d.js");case"7.0":return await import("./assets/php_7_0-f028e192.js")}else switch(e){case"8.3":return await import("./assets/php_8_3-4d8e97bf.js");case"8.2":return await import("./assets/php_8_2-d3fc82c4.js");case"8.1":return await import("./assets/php_8_1-8a90b8ee.js");case"8.0":return await import("./assets/php_8_0-eb2cf5b2.js");case"7.4":return await import("./assets/php_7_4-25205660.js");case"7.3":return await import("./assets/php_7_3-aedaba49.js");case"7.2":return await import("./assets/php_7_2-55a563c2.js");case"7.1":return await import("./assets/php_7_1-ef35e2e3.js");case"7.0":return await import("./assets/php_7_0-9caa066f.js")}throw new Error(`Unsupported PHP version ${e}`)}const fakeWebsocket=()=>({websocket:{decorator:e=>class extends e{constructor(){try{super()}catch{}}send(){return null}}}});async function loadWebRuntime(e,t={}){const r=t.loadAllExtensions?"kitchen-sink":"light",n=await getPHPLoaderModule(e,r);return t.onPhpLoaderModuleLoaded?.(n),await loadPHPRuntime(n,{...t.emscriptenOptions||{},...fakeWebsocket()})}function isURLScoped(e){return e.pathname.startsWith("/scope:")}function setURLScope(e,t){let r=new URL(e);if(isURLScoped(r))if(t){const n=r.pathname.split("/");n[1]=`scope:${t}`,r.pathname=n.join("/")}else r=removeURLScope(r);else if(t){const n=r.pathname==="/"?"":r.pathname;r.pathname=`/scope:${t}${n}`}return r}function removeURLScope(e){if(!isURLScoped(e))return e;const t=new URL(e),r=t.pathname.split("/");return t.pathname="/"+r.slice(2).join("/"),t}function journalFSEvents(e,t,r=()=>{}){function n(){t=normalizePath(t);const i=e[__private__dont__use].FS,o=createFSHooks(i,u=>{if(u.path.startsWith(t))r(u);else if(u.operation==="RENAME"&&u.toPath.startsWith(t))for(const d of recordExistingPath(e,u.path,u.toPath))r(d)}),a={};for(const[u]of Object.entries(o))a[u]=i[u];function c(){for(const[u,d]of Object.entries(o))i[u]=function(...p){return d(...p),a[u].apply(this,p)}}function l(){for(const[u,d]of Object.entries(a))e[__private__dont__use].FS[u]=d}e[__private__dont__use].journal={bind:c,unbind:l},c()}e.addEventListener("runtime.initialized",n),e[__private__dont__use]&&n();function s(){e[__private__dont__use].journal.unbind(),delete e[__private__dont__use].journal}return e.addEventListener("runtime.beforedestroy",s),function(){return e.removeEventListener("runtime.initialized",n),e.removeEventListener("runtime.beforedestroy",s),e[__private__dont__use].journal.unbind()}}const createFSHooks=(e,t=()=>{})=>({write(r){t({operation:"WRITE",path:r.path,nodeType:"file"})},truncate(r){let n;typeof r=="string"?n=e.lookupPath(r,{follow:!0}).node:n=r,t({operation:"WRITE",path:e.getPath(n),nodeType:"file"})},unlink(r){t({operation:"DELETE",path:r,nodeType:"file"})},mknod(r,n){e.isFile(n)&&t({operation:"CREATE",path:r,nodeType:"file"})},mkdir(r){t({operation:"CREATE",path:r,nodeType:"directory"})},rmdir(r){t({operation:"DELETE",path:r,nodeType:"directory"})},rename(r,n){try{const s=e.lookupPath(r,{follow:!0}),i=e.lookupPath(n,{parent:!0}).path;t({operation:"RENAME",nodeType:e.isDir(s.node.mode)?"directory":"file",path:s.path,toPath:joinPaths(i,basename(n))})}catch{}}});function replayFSJournal(e,t){e[__private__dont__use].journal.unbind();try{for(const r of t)r.operation==="CREATE"?r.nodeType==="file"?e.writeFile(r.path," "):e.mkdir(r.path):r.operation==="DELETE"?r.nodeType==="file"?e.unlink(r.path):e.rmdir(r.path):r.operation==="WRITE"?e.writeFile(r.path,r.data):r.operation==="RENAME"&&e.mv(r.path,r.toPath)}finally{e[__private__dont__use].journal.bind()}}function*recordExistingPath(e,t,r){if(e.isDir(t)){yield{operation:"CREATE",path:r,nodeType:"directory"};for(const n of e.listFiles(t))yield*recordExistingPath(e,joinPaths(t,n),joinPaths(r,n))}else yield{operation:"CREATE",path:r,nodeType:"file"},yield{operation:"WRITE",nodeType:"file",path:r}}function normalizePath(e){return e.replace(/\/$/,"").replace(/\/\/+/g,"/")}function createDirectoryHandleMountHandler(e,t={initialSync:{}}){return t={...t,initialSync:{...t.initialSync,direction:t.initialSync.direction??"opfs-to-memfs"}},async function(r,n,s){return t.initialSync.direction==="opfs-to-memfs"?(FSHelpers.fileExists(n,s)&&FSHelpers.rmdir(n,s),FSHelpers.mkdir(n,s),await copyOpfsToMemfs(n,e,s)):await copyMemfsToOpfs(n,e,s,t.initialSync.onProgress),journalFSEventsToOpfs(r,e,s)}}async function copyOpfsToMemfs(e,t,r){FSHelpers.mkdir(e,r);const n=new Semaphore({concurrency:40}),s=[],i=[[t,r]];for(;i.length>0;){const[o,a]=i.pop();for await(const c of o.values()){const l=n.run(async()=>{const u=joinPaths(a,c.name);if(c.kind==="directory"){try{e.mkdir(u)}catch(d){if(d?.errno!==20)throw logger.error(d),d}i.push([c,u])}else if(c.kind==="file"){const d=await c.getFile(),p=new Uint8Array(await d.arrayBuffer());e.createDataFile(a,c.name,p,!0,!0,!0)}s.splice(s.indexOf(l),1)});s.push(l)}for(;i.length===0&&s.length>0;)await Promise.any(s)}}async function copyMemfsToOpfs(e,t,r,n){e.mkdirTree(r);const s=[];async function i(c,l){await Promise.all(e.readdir(c).filter(u=>u!=="."&&u!=="..").map(async u=>{const d=joinPaths(c,u);if(!isMemfsDir(e,d)){s.push([l,d,u]);return}const p=await l.getDirectoryHandle(u,{create:!0});return await i(d,p)}))}await i(r,t);let o=0;const a=s.map(([c,l,u])=>overwriteOpfsFile(c,u,e,l).then(()=>{n?.({files:++o,total:s.length})}));await Promise.all(a)}function isMemfsDir(e,t){return e.isDir(e.lookupPath(t,{follow:!0}).node.mode)}async function overwriteOpfsFile(e,t,r,n){let s;try{s=r.readFile(n,{encoding:"binary"})}catch{return}const i=await e.getFileHandle(t,{create:!0}),o=i.createWritable!==void 0?await i.createWritable():await i.createSyncAccessHandle();try{await o.truncate(0),await o.write(s)}finally{await o.close()}}function journalFSEventsToOpfs(e,t,r){const n=[],s=journalFSEvents(e,r,a=>{n.push(a)}),i=new OpfsRewriter(e,t,r);async function o(){const a=await e.semaphore.acquire();try{for(;n.length;)await i.processEntry(n.shift())}finally{a()}}return e.addEventListener("request.end",o),function(){s(),e.removeEventListener("request.end",o)}}class OpfsRewriter{constructor(t,r,n){this.php=t,this.opfs=r,this.memfsRoot=normalizeMemfsPath(n)}toOpfsPath(t){return normalizeMemfsPath(t.substring(this.memfsRoot.length))}async processEntry(t){if(!t.path.startsWith(this.memfsRoot)||t.path===this.memfsRoot)return;const r=this.toOpfsPath(t.path),n=await resolveParent(this.opfs,r),s=getFilename(r);if(s)try{if(t.operation==="DELETE")try{await n.removeEntry(s,{recursive:!0})}catch{}else if(t.operation==="CREATE")t.nodeType==="directory"?await n.getDirectoryHandle(s,{create:!0}):await n.getFileHandle(s,{create:!0});else if(t.operation==="WRITE")await overwriteOpfsFile(n,s,this.php[__private__dont__use].FS,t.path);else if(t.operation==="RENAME"&&t.toPath.startsWith(this.memfsRoot)){const i=this.toOpfsPath(t.toPath),o=await resolveParent(this.opfs,i),a=getFilename(i);if(t.nodeType==="directory"){const c=await o.getDirectoryHandle(s,{create:!0});await copyMemfsToOpfs(this.php[__private__dont__use].FS,c,t.toPath),await n.removeEntry(s,{recursive:!0})}else(await n.getFileHandle(s)).move(o,a)}}catch(i){throw logger.log({entry:t,name:s}),logger.error(i),i}}}function normalizeMemfsPath(e){return e.replace(/\/$/,"").replace(/\/\/+/g,"/")}function getFilename(e){return e.substring(e.lastIndexOf("/")+1)}async function resolveParent(e,t){const r=t.replace(/^\/+|\/+$/g,"").replace(/\/+/,"/");if(!r)return e;const n=r.split("/");let s=e;for(let i=0;i<n.length-1;i++){const o=n[i];s=await s.getDirectoryHandle(o,{create:!0})}return s}const wordPressSiteUrl=new URL("/",(import.meta||{}).url).origin;var url_nightly="/assets/wp-nightly-87c556a2.zip",url_beta="/assets/wp-beta-9249a1ed.zip",url_6_5="/assets/wp-6.5-7523e948.zip",url_6_4="/assets/wp-6.4-2a25ebf0.zip",url_6_3="/assets/wp-6.3-636a5352.zip",url_6_2="/assets/wp-6.2-8766e4c4.zip";function getWordPressModuleDetails(e="6.5"){switch(e){case"nightly":return{size:4957122,url:url_nightly};case"beta":return{size:4955558,url:url_beta};case"6.5":return{size:4887146,url:url_6_5};case"6.4":return{size:4774010,url:url_6_4};case"6.3":return{size:3594811,url:url_6_3};case"6.2":return{size:3497726,url:url_6_2}}throw new Error("Unsupported WordPress module: "+e)}var url$1="/assets/sqlite-database-integration-fd6f4063.zip";const size=84013,nightly="nightly",beta="6.6-beta2";var SupportedWordPressVersions={nightly,beta,"6.5":"6.5.4","6.4":"6.4.4","6.3":"6.3.4","6.2":"6.2.5"};const SupportedWordPressVersionsList=Object.keys(SupportedWordPressVersions),LatestSupportedWordPressVersion=SupportedWordPressVersionsList.filter(e=>e.match(/^\d/))[0];let unmount;async function bindOpfs({php:e,opfs:t,initialSyncDirection:r,mountpoint:n,onProgress:s}){n=n||e.documentRoot,r=r||"opfs-to-memfs",unmount&&unmount();const i=createDirectoryHandleMountHandler(t,{initialSync:{direction:r,onProgress:s}});unmount=await e.mount(n,i)}async function playgroundAvailableInOpfs(e){try{await e.getFileHandle("wp-config.php",{create:!1}),await(await(await e.getDirectoryHandle("wp-content",{create:!1})).getDirectoryHandle("database",{create:!1})).getFileHandle(".ht.sqlite",{create:!1})}catch{return!1}return!0}const FALLBACK_FILE_SIZE=5*1024*1024;class EmscriptenDownloadMonitor extends EventTarget{#e={};#t={};expectAssets(t){for(const[r,n]of Object.entries(t)){const s="http://example.com/",o=new URL(r,s).pathname.split("/").pop();o in this.#e||(this.#e[o]=n),o in this.#t||(this.#t[o]=0)}}async monitorFetch(t){const r=await t;return cloneResponseMonitorProgress(r,s=>{this.#n(r.url,s.detail.loaded,s.detail.total)})}#n(t,r,n){const s=new URL(t,"http://example.com").pathname.split("/").pop();n?s in this.#e||(this.#e[s]=n,this.#t[s]=r):n=this.#e[s],s in this.#t||logger.warn(`Registered a download #progress of an unregistered file "${s}". This may cause a sudden **decrease** in the #progress percentage as the total number of bytes increases during the download.`),this.#t[s]=r,this.dispatchEvent(new CustomEvent("progress",{detail:{loaded:sumValues(this.#t),total:sumValues(this.#e)}}))}}function sumValues(e){return Object.values(e).reduce((t,r)=>t+r,0)}function cloneResponseMonitorProgress(e,t){const r=e.headers.get("content-length")||"",n=parseInt(r,10)||FALLBACK_FILE_SIZE;function s(i,o){t(new CustomEvent("progress",{detail:{loaded:i,total:o}}))}return new Response(new ReadableStream({async start(i){if(!e.body){i.close();return}const o=e.body.getReader();let a=0;for(;;)try{const{done:c,value:l}=await o.read();if(l&&(a+=l.byteLength),c){s(a,a),i.close();break}else s(a,n),i.enqueue(l)}catch(c){logger.error({e:c}),i.error(c);break}}}),{status:e.status,statusText:e.statusText,headers:e.headers})}function createMemoizedFetch(e=fetch){const t={};return async function(n,s){t[n]||(t[n]=e(n,s).then(l=>({body:l.body,responseInit:{status:l.status,statusText:l.statusText,headers:l.headers}})));const{body:i,responseInit:o}=await t[n],[a,c]=i.tee();return t[n]={body:a,responseInit:o},new Response(c,o)}}const receivedParams={},url=self?.location?.href;if(typeof url<"u"){const e=new URL(self.location.href).searchParams;receivedParams.wpVersion=e.get("wpVersion")||void 0,receivedParams.phpVersion=e.get("phpVersion")||void 0,receivedParams.storage=e.get("storage")||void 0,receivedParams.sapiName=e.get("sapiName")||"cli",receivedParams.phpExtensions=e.getAll("php-extension"),receivedParams.siteSlug=e.get("site-slug")||void 0}const requestedWPVersion=receivedParams.wpVersion||"",startupOptions={wpVersion:SupportedWordPressVersionsList.includes(requestedWPVersion)?requestedWPVersion:LatestSupportedWordPressVersion,phpVersion:SupportedPHPVersionsList.includes(receivedParams.phpVersion||"")?receivedParams.phpVersion:"8.0",sapiName:receivedParams.sapiName||"cli",storage:receivedParams.storage||"local",phpExtensions:receivedParams.phpExtensions||[],siteSlug:receivedParams.siteSlug},downloadMonitor=new EmscriptenDownloadMonitor,monitoredFetch=(e,t)=>downloadMonitor.monitorFetch(fetch(e,t)),memoizedFetch=createMemoizedFetch(monitoredFetch),createPhpRuntime=async()=>{let e="";return await loadWebRuntime(startupOptions.phpVersion,{onPhpLoaderModuleLoaded:t=>{e=t.dependencyFilename,downloadMonitor.expectAssets({[e]:t.dependenciesTotalSize})},loadAllExtensions:startupOptions.phpExtensions?.length>0,emscriptenOptions:{instantiateWasm(t,r){return memoizedFetch(e,{credentials:"same-origin"}).then(n=>WebAssembly.instantiateStreaming(n,t)).then(n=>{r(n.instance,n.module)}),{}}}})};function spawnHandlerFactory(e){return createSpawnHandler(async function(t,r,n){if(t[0]==="exec"&&t.shift(),t[0]==="/usr/bin/env"&&t[1]==="stty"&&t[2]==="size")r.stdout("18 140"),r.exit(0);else if(t[0]==="less")r.on("stdin",s=>{r.stdout(s)}),r.flushStdin(),r.exit(0);else if(t[0]==="fetch"){r.flushStdin(),fetch(t[1]).then(async s=>{const i=s.body?.getReader();if(!i){r.exit(1);return}for(;;){const{done:o,value:a}=await i.read();if(o){r.exit(0);break}r.stdout(a)}});return}else if(t[0]==="php"){const{php:s,reap:i}=await e.acquirePHPInstance();let o;try{const a=`<?php
                // Set the argv global.
                $GLOBALS['argv'] = array_merge([
                    "/wordpress/wp-cli.phar",
                    "--path=/wordpress"
                ], ${phpVar(t.slice(2))});

                // Provide stdin, stdout, stderr streams outside of
                // the CLI SAPI.
                define('STDIN', fopen('php://stdin', 'rb'));
                define('STDOUT', fopen('php://stdout', 'wb'));
                define('STDERR', fopen('/tmp/stderr', 'wb'));

                ${n.cwd?'chdir(getenv("DOCROOT")); ':""}
                `;t.includes("-r")?o=await s.run({code:`${a} ${t[t.indexOf("-r")+1]}`,env:n.env}):t[1]==="wp-cli.phar"?o=await s.run({code:`${a} require( "/wordpress/wp-cli.phar" );`,env:{...n.env,SHELL_PIPE:"0"}}):o=await s.run({scriptPath:t[1],env:n.env}),r.stdout(o.bytes),r.stderr(o.errors),r.exit(o.exitCode)}catch(a){logger.error("Error in childPHP:",a),a instanceof Error&&r.stderr(a.message),r.exit(1)}finally{i()}}else r.exit(1)})}var transportFetch=`<?php

/**
 * This transport delegates PHP HTTP requests to JavaScript synchronous XHR.
 *
 * This file isn't actually used. It's just here for reference and development. The actual
 * PHP code used in WordPress is hardcoded copy residing in wordpress.mjs in the _patchWordPressCode
 * function.
 *
 * The reason for calling it Wp_Http_Fetch and not something more natural like
 * Requests_Transport_Fetch is the _get_first_available_transport(). It checks for
 * a class named "Wp_Http_" . $transport_name – which means we must adhere to this
 * hardcoded pattern.
 */
class Wp_Http_Fetch_Base
{
	public $headers = '';

	public function __construct()
	{
	}

	public function __destruct()
	{
	}

	/**
	 * Delegates PHP HTTP requests to JavaScript synchronous XHR.
	 *
	 * @TODO Implement handling for more $options such as cookies, filename, auth, etc.
	 *
	 * @param $url
	 * @param $headers
	 * @param $data
	 * @param $options
	 *
	 * @return false|string
	 */
	public function request($url, $headers = array(), $data = array(), $options = array())
	{
		// Disable wp-cron requests that are extremely slow in node.js runtime environment.
		// @TODO: Make wp-cron requests faster.
		if (str_contains($url, '/wp-cron.php')) {
			return false;
		}

		if (!empty($data)) {
			$data_format = $options['data_format'];
			if ($data_format === 'query') {
				$url = self::format_get($url, $data);
				$data = '';
			} elseif (!is_string($data)) {
				$data = http_build_query($data, '', '&');
			}
		}

		$request = json_encode(
			array(
				'type' => 'request',
				'data' => [
					'headers' => $headers,
					'data' => $data,
					'url' => $url,
					'method' => $options['type'],
				]
			)
		);

		$this->headers = post_message_to_js($request);

		// Store a file if the request specifies it.
		// Are we sure that \`$this->headers\` includes the body of the response?
		$before_response_body = strpos($this->headers, "\\r\\n\\r\\n");
		if (isset($options['filename']) && $options['filename'] && false !== $before_response_body) {
			$response_body = substr($this->headers, $before_response_body + 4);
			$this->headers = substr($this->headers, 0, $before_response_body);
			file_put_contents($options['filename'], $response_body);
		}

		return $this->headers;
	}

	public function request_multiple($requests, $options)
	{
		$responses = array();
		$class = get_class($this);
		foreach ($requests as $id => $request) {
			try {
				$handler = new $class();
				$responses[$id] = $handler->request($request['url'], $request['headers'], $request['data'], $request['options']);
				$request['options']['hooks']->dispatch('transport.internal.parse_response', array(&$responses[$id], $request));
			} catch (Requests_Exception $e) {
				$responses[$id] = $e;
			}
			if (!is_string($responses[$id])) {
				$request['options']['hooks']->dispatch('multiple.request.complete', array(&$responses[$id], $id));
			}
		}

		return $responses;
	}

	protected static function format_get($url, $data)
	{
		if (!empty($data)) {
			$query = '';
			$url_parts = parse_url($url);
			if (empty($url_parts['query'])) {
				$url_parts['query'] = '';
			} else {
				$query = $url_parts['query'];
			}
			$query .= '&' . http_build_query($data, '', '&');
			$query = trim($query, '&');
			if (empty($url_parts['query'])) {
				$url .= '?' . $query;
			} else {
				$url = str_replace($url_parts['query'], $query, $url);
			}
		}

		return $url;
	}

	public static function test($capabilities = array())
	{
		if (!function_exists('post_message_to_js')) {
			return false;
		}

		return true;
	}
}

if (class_exists('\\WpOrg\\Requests\\Requests')) {
	class Wp_Http_Fetch extends Wp_Http_Fetch_Base implements \\WpOrg\\Requests\\Transport
	{

	}
} else {
	class Wp_Http_Fetch extends Wp_Http_Fetch_Base implements Requests_Transport
	{

	}
}
`,transportDummy=`<?php

/**
 * This transport does not perform any HTTP requests and only exists
 * to prevent the Requests class from complaining about not having any
 * transports.
 * 
 * The reason for calling it Wp_Http_Dummy and not something more natural like
 * Requests_Transport_Dummy is the _get_first_available_transport(). It checks for
 * a class named "Wp_Http_" . $transport_name – which means we must adhere to this
 * hardcoded pattern.
 */
class Wp_Http_Dummy_Base
{
	public $headers = '';

	public function __construct()
	{
	}

	public function __destruct()
	{
	}

	public function request($url, $headers = array(), $data = array(), $options = array())
	{
		return false;
	}

	public function request_multiple($requests, $options)
	{
		$responses = array();
		foreach ($requests as $id => $request) {
			$responses[] = false;
		}
		return $responses;
	}

	protected static function format_get($url, $data)
	{
		return $url;
	}

	public static function test($capabilities = array())
	{
		return true;
	}
}

if (class_exists('\\WpOrg\\Requests\\Requests')) {
	class Wp_Http_Dummy extends Wp_Http_Dummy_Base implements \\WpOrg\\Requests\\Transport
	{

	}
} else {
	class Wp_Http_Dummy extends Wp_Http_Dummy_Base implements Requests_Transport
	{

	}
}
`,playgroundWebMuPlugin=`<?php

/**
 * Add a notice to wp-login.php offering the username and password.
 */
add_filter(
	'login_message',
	function ( $message ) {
		return $message . <<<EOT
<div class="message info">
	<strong>username:</strong> <code>admin</code><br><strong>password</strong>: <code>password</code>
</div>
EOT;
	}
);

/**
 * Because the in-browser Playground doesn't have access to the internet,
 * network-dependent features like directories don't work. Normally, you'll
 * see a confusing message like "An unexpected error occurred." This mu-plugin
 * makes it more clear that the feature is not yet supported.
 *
 * https://github.com/WordPress/wordpress-playground/issues/498
 *
 * Added styling to hide the Popular tags section of the Plugins page
 * and the nonfunctional Try Again button (both Plugins and Themes) that's
 * appended when the message is displayed.
 *
 * https://github.com/WordPress/wordpress-playground/issues/927
 *
 */
add_action('admin_head', function () {
	echo '<style>
				:is(.plugins-popular-tags-wrapper:has(div.networking_err_msg),
				button.button.try-again) {
						display: none;
				}
		</style>';
});

add_action('init', 'networking_disabled');
function networking_disabled() {
	$networking_err_msg = '<div class="networking_err_msg">Network access is an <a href="https://github.com/WordPress/wordpress-playground/issues/85" target="_blank">experimental, opt-in feature</a>, which means you need to enable it to allow Playground to access the Plugins/Themes directories.
	<p>There are two alternative methods to enable global networking support:</p>
	<ol>
	<li>Using the <a href="https://wordpress.github.io/wordpress-playground/query-api">Query API</a>: for example, https://playground.wordpress.net/<em>?networking=yes</em>; <strong>or</strong>
	<li> Using the <a href="https://wordpress.github.io/wordpress-playground/blueprints-api/data-format/#features">Blueprint API</a>: add <code>"features": { "networking": true }</code> to the JSON file.
	</li></ol>
	<p>
	When browsing Playground as a standalone instance, you can enable networking via the settings panel: select the option "Network access (e.g. for browsing plugins)" and hit the "Apply changes" button.<p>
	<strong>Please note:</strong> This option is hidden when browsing Playground as an embedded iframe.</p></div>';
	return $networking_err_msg;
}

add_filter('plugins_api_result', function ($res) {
	if ($res instanceof WP_Error) {
		$res = new WP_Error(
			'plugins_api_failed',
			networking_disabled()
		);
	}
	return $res;
});

add_filter('gettext', function ($translation) {
	if( $GLOBALS['pagenow'] === 'theme-install.php') {
		if ($translation === 'An unexpected error occurred. Something may be wrong with WordPress.org or this server&#8217;s configuration. If you continue to have problems, please try the <a href="%s">support forums</a>.') {
			return networking_disabled();
		}
	}
	return $translation;
});

/**
 * Links with target="top" don't work in the playground iframe because of
 * the sandbox attribute. What they really should be targeting is the
 * playground iframe itself (name="playground"). This mu-plugin rewrites
 * all target="_top" links to target="playground" instead.
 *
 * https://github.com/WordPress/wordpress-playground/issues/266
 */
add_action('admin_print_scripts', function () {
	?>
	<script>
		document.addEventListener('click', function (event) {
			if (event.target.tagName === 'A' && ['_parent', '_top'].includes(event.target.target)) {
				event.target.target = 'wordpress-playground';
			}
		});
	<\/script>
	<?php
});

/**
 * The default WordPress requests transports have been disabled
 * at this point. However, the Requests class requires at least
 * one working transport or else it throws warnings and acts up.
 *
 * This mu-plugin provides that transport. It's one of the two:
 *
 * * WP_Http_Fetch – Sends requests using browser's fetch() function.
 * * Requests_Transport_Dummy – Does not send any requests and only exists to keep
 * 								the Requests class happy.
 */
$__requests_class = class_exists( '\\WpOrg\\Requests\\Requests' ) ? '\\WpOrg\\Requests\\Requests' : 'Requests';
if (defined('USE_FETCH_FOR_REQUESTS') && USE_FETCH_FOR_REQUESTS) {
	require(__DIR__ . '/playground-includes/wp_http_fetch.php');
	/**
	 * Force the Fetch transport to be used in Requests.
	 * The 'http_api_transports' filter was deprecated, and is no longer actively in use.
	 */
	add_action( 'requests-requests.before_request', function( $url, $headers, $data, $type, &$options ) {
		$options['transport'] = 'Wp_Http_Fetch';
	}, 10, 5 );

	/**
	 * Disable signature verification as it doesn't seem to work with
	 * fetch requests:
	 *
	 * https://downloads.wordpress.org/plugin/classic-editor.zip returns no signature header.
	 * https://downloads.wordpress.org/plugin/classic-editor.zip.sig returns 404.
	 *
	 * @TODO Investigate why.
	 */
	add_filter('wp_signature_hosts', function ($hosts) {
		return [];
	});

	// add_filter('http_request_host_is_external', function ($arg) {
	// 	return true;
	// });
	add_filter('http_request_host_is_external', '__return_true');
} else {
	require(__DIR__ . '/playground-includes/wp_http_dummy.php');
	$__requests_class::add_transport('Wp_Http_Dummy');

	add_action( 'requests-requests.before_request', function( $url, $headers, $data, $type, &$options ) {
		$options['transport'] = 'Wp_Http_Dummy';
	}, 10, 5 );
}

?>
`;const tmpPath="/tmp/file.zip",unzipFile=async(e,t,r)=>{if(t instanceof File){const s=t;t=tmpPath,await e.writeFile(t,new Uint8Array(await s.arrayBuffer()))}const n=phpVars({zipPath:t,extractToPath:r});await e.run({code:`<?php
        function unzip($zipPath, $extractTo, $overwrite = true)
        {
            if (!is_dir($extractTo)) {
                mkdir($extractTo, 0777, true);
            }
            $zip = new ZipArchive;
            $res = $zip->open($zipPath);
            if ($res === TRUE) {
                $zip->extractTo($extractTo);
                $zip->close();
                chmod($extractTo, 0777);
            } else {
                throw new Exception("Could not unzip file");
            }
        }
        unzip(${n.zipPath}, ${n.extractToPath});
        `}),await e.fileExists(tmpPath)&&await e.unlink(tmpPath)};async function bootWordPress(e){async function t(s,i){const o=new PHP(await e.createPhpRuntime());return e.sapiName&&o.setSapiName(e.sapiName),s&&(o.requestHandler=s),e.phpIniEntries&&setPhpIniEntries(o,e.phpIniEntries),i?(await setupPlatformLevelMuPlugins(o),await writeFiles(o,"/",e.createFiles||{}),await preloadPhpInfoRoute(o,joinPaths(new URL(e.siteUrl).pathname,"phpinfo.php"))):proxyFileSystem(await s.getPrimaryPhp(),o,["/tmp",s.documentRoot,"/internal/shared"]),e.spawnHandler&&await o.setSpawnHandler(e.spawnHandler(s.processManager)),rotatePHPRuntime({php:o,cwd:s.documentRoot,recreateRuntime:e.createPhpRuntime,maxRequests:400}),o}const r=new PHPRequestHandler({phpFactory:async({isPrimary:s})=>t(r,s),documentRoot:e.documentRoot||"/wordpress",absoluteUrl:e.siteUrl,rewriteRules:wordPressRewriteRules}),n=await r.getPrimaryPhp();if(e.hooks?.beforeWordPressFiles&&await e.hooks.beforeWordPressFiles(n),e.wordPressZip&&await unzipWordPress(n,await e.wordPressZip),e.constants)for(const s in e.constants)n.defineConstant(s,e.constants[s]);if(n.defineConstant("WP_HOME",e.siteUrl),n.defineConstant("WP_SITEURL",e.siteUrl),e.hooks?.beforeDatabaseSetup&&await e.hooks.beforeDatabaseSetup(n),e.sqliteIntegrationPluginZip&&await preloadSqliteIntegration(n,await e.sqliteIntegrationPluginZip),await isWordPressInstalled(n)||await installWordPress(n),!await isWordPressInstalled(n))throw new Error("WordPress installation has failed.");return r}async function isWordPressInstalled(e){return(await e.run({code:`<?php 
	require '${e.documentRoot}/wp-load.php';
	echo is_blog_installed() ? '1' : '0';
	`})).text==="1"}async function installWordPress(e){await withPHPIniValues(e,{disable_functions:"fsockopen",allow_url_fopen:"0"},async()=>await e.request({url:"/wp-admin/install.php?step=2",method:"POST",body:{language:"en",prefix:"wp_",weblog_title:"My WordPress Website",user_name:"admin",admin_password:"password",admin_password2:"password",Submit:"Install WordPress",pw_weak:"1",admin_email:"admin@localhost.com"}}))}const wordPressRewriteRules=[{match:/^\/(.*?)(\/wp-(content|admin|includes)\/.*)/g,replacement:"$2"}];async function setupPlatformLevelMuPlugins(e){await e.mkdir("/internal/shared/mu-plugins"),await e.writeFile("/internal/shared/preload/env.php",`<?php
    
        // Allow adding filters/actions prior to loading WordPress.
        // $function_to_add MUST be a string.
        function playground_add_filter( $tag, $function_to_add, $priority = 10, $accepted_args = 1 ) {
            global $wp_filter;
            $wp_filter[$tag][$priority][$function_to_add] = array('function' => $function_to_add, 'accepted_args' => $accepted_args);
        }
        function playground_add_action( $tag, $function_to_add, $priority = 10, $accepted_args = 1 ) {
            playground_add_filter( $tag, $function_to_add, $priority, $accepted_args );
        }
        
        // Load our mu-plugins after customer mu-plugins
        // NOTE: this means our mu-plugins can't use the muplugins_loaded action!
        playground_add_action( 'muplugins_loaded', 'playground_load_mu_plugins', 0 );
        function playground_load_mu_plugins() {
            // Load all PHP files from /internal/shared/mu-plugins, sorted by filename
            $mu_plugins_dir = '/internal/shared/mu-plugins';
            if(!is_dir($mu_plugins_dir)){
                return;
            }
            $mu_plugins = glob( $mu_plugins_dir . '/*.php' );
            sort( $mu_plugins );
            foreach ( $mu_plugins as $mu_plugin ) {
                require_once $mu_plugin;
            }
        }
    `),await e.writeFile("/internal/shared/mu-plugins/0-playground.php",`<?php
        // Redirect /wp-admin to /wp-admin/
        add_filter( 'redirect_canonical', function( $redirect_url ) {
            if ( '/wp-admin' === $redirect_url ) {
                return $redirect_url . '/';
            }
            return $redirect_url;
        } );
		
        // Needed because gethostbyname( 'wordpress.org' ) returns
        // a private network IP address for some reason.
        add_filter( 'allowed_redirect_hosts', function( $deprecated = '' ) {
            return array(
                'wordpress.org',
                'api.wordpress.org',
                'downloads.wordpress.org',
            );
        } );

		// Support pretty permalinks
        add_filter( 'got_url_rewrite', '__return_true' );

        // Create the fonts directory if missing
        if(!file_exists(WP_CONTENT_DIR . '/fonts')) {
            mkdir(WP_CONTENT_DIR . '/fonts');
        }
		
        $log_file = WP_CONTENT_DIR . '/debug.log';
        define('ERROR_LOG_FILE', $log_file);
        ini_set('error_log', $log_file);
        ?>`),await e.writeFile("/internal/shared/preload/error-handler.php",`<?php
		(function() { 
			$playground_consts = [];
			if(file_exists('/internal/shared/consts.json')) {
				$playground_consts = @json_decode(file_get_contents('/internal/shared/consts.json'), true) ?: [];
				$playground_consts = array_keys($playground_consts);
			}
			set_error_handler(function($severity, $message, $file, $line) use($playground_consts) {
				/**
				 * This is a temporary workaround to hide the 32bit integer warnings that
				 * appear when using various time related function, such as strtotime and mktime.
				 * Examples of the warnings that are displayed:
				 *
				 * Warning: mktime(): Epoch doesn't fit in a PHP integer in <file>
				 * Warning: strtotime(): Epoch doesn't fit in a PHP integer in <file>
				 */
				if (strpos($message, "fit in a PHP integer") !== false) {
					return;
				}
				/**
				 * Playground defines some constants upfront, and some of them may be redefined
				 * in wp-config.php. For example, SITE_URL or WP_DEBUG. This is expected and
				 * we want Playground constants to take priority without showing warnings like:
				 *
				 * Warning: Constant SITE_URL already defined in
				 */
				if (strpos($message, "already defined") !== false) {
					foreach($playground_consts as $const) {
						if(strpos($message, "Constant $const already defined") !== false) {
							return;
						}
					}
				}
				/**
				 * Don't complain about network errors when not connected to the network.
				 */
				if (
					(
						! defined('USE_FETCH_FOR_REQUESTS') ||
						! USE_FETCH_FOR_REQUESTS
					) &&
					strpos($message, "WordPress could not establish a secure connection to WordPress.org") !== false)
				{
					return;
				}
				return false;
			});
		})();`)}async function preloadPhpInfoRoute(e,t="/phpinfo.php"){await e.writeFile("/internal/shared/preload/phpinfo.php",`<?php
    // Render PHPInfo if the requested page is /phpinfo.php
    if ( ${phpVar(t)} === $_SERVER['REQUEST_URI'] ) {
        phpinfo();
        exit;
    }
    `)}async function preloadSqliteIntegration(e,t){await e.isDir("/tmp/sqlite-database-integration")&&await e.rmdir("/tmp/sqlite-database-integration",{recursive:!0}),await e.mkdir("/tmp/sqlite-database-integration"),await unzipFile(e,t,"/tmp/sqlite-database-integration");const r="/internal/shared/sqlite-database-integration";await e.mv("/tmp/sqlite-database-integration/sqlite-database-integration-main",r),await e.defineConstant("SQLITE_MAIN_FILE","1");const s=(await e.readFileAsText(joinPaths(r,"db.copy"))).replace("'{SQLITE_IMPLEMENTATION_FOLDER_PATH}'",phpVar(r)).replace("'{SQLITE_PLUGIN}'",phpVar(joinPaths(r,"load.php"))),i=joinPaths(await e.documentRoot,"wp-content/db.php"),o=`<?php
	// Do not preload this if WordPress comes with a custom db.php file.
	if(file_exists(${phpVar(i)})) {
		return;
	}
	?>`,a="/internal/shared/mu-plugins/sqlite-database-integration.php";await e.writeFile(a,o+s),await e.writeFile("/internal/shared/preload/0-sqlite.php",o+`<?php

/**
 * Loads the SQLite integration plugin before WordPress is loaded
 * and without creating a drop-in "db.php" file. 
 *
 * Technically, it creates a global $wpdb object whose only two
 * purposes are to:
 *
 * * Exist – because the require_wp_db() WordPress function won't
 *           connect to MySQL if $wpdb is already set.
 * * Load the SQLite integration plugin the first time it's used
 *   and replace the global $wpdb reference with the SQLite one.
 *
 * This lets Playground keep the WordPress installation clean and
 * solves dillemas like:
 *
 * * Should we include db.php in Playground exports?
 * * Should we remove db.php from Playground imports?
 * * How should we treat stale db.php from long-lived OPFS sites?
 *
 * @see https://github.com/WordPress/wordpress-playground/discussions/1379 for
 *      more context.
 */
class Playground_SQLite_Integration_Loader {
	public function __call($name, $arguments) {
		$this->load_sqlite_integration();
		if($GLOBALS['wpdb'] === $this) {
			throw new Exception('Infinite loop detected in $wpdb – SQLite integration plugin could not be loaded');
		}
		return call_user_func_array(
			array($GLOBALS['wpdb'], $name),
			$arguments
		);
	}
	public function __get($name) {
		$this->load_sqlite_integration();
		if($GLOBALS['wpdb'] === $this) {
			throw new Exception('Infinite loop detected in $wpdb – SQLite integration plugin could not be loaded');
		}
		return $GLOBALS['wpdb']->$name;
	}
	public function __set($name, $value) {
		$this->load_sqlite_integration();
		if($GLOBALS['wpdb'] === $this) {
			throw new Exception('Infinite loop detected in $wpdb – SQLite integration plugin could not be loaded');
		}
		$GLOBALS['wpdb']->$name = $value;
	}
    protected function load_sqlite_integration() {
        require_once ${phpVar(a)};
    }
}
$wpdb = $GLOBALS['wpdb'] = new Playground_SQLite_Integration_Loader();

/**
 * WordPress is capable of using a preloaded global $wpdb. However, if
 * it cannot find the drop-in db.php plugin it still checks whether
 * the mysqli_connect() function exists even though it's not used.
 *
 * What WordPress demands, Playground shall provide.
 */
if(!function_exists('mysqli_connect')) {
	function mysqli_connect() {}
}

		`),await e.writeFile("/internal/shared/mu-plugins/sqlite-test.php",`<?php
		global $wpdb;
		if(!($wpdb instanceof WP_SQLite_DB)) {
			var_dump(isset($wpdb));
			die("SQLite integration not loaded " . get_class($wpdb));
		}
		`)}async function unzipWordPress(e,t){e.mkdir("/tmp/unzipped-wordpress"),await unzipFile(e,t,"/tmp/unzipped-wordpress"),e.fileExists("/tmp/unzipped-wordpress/wordpress.zip")&&await unzipFile(e,"/tmp/unzipped-wordpress/wordpress.zip","/tmp/unzipped-wordpress");const r=e.fileExists("/tmp/unzipped-wordpress/wordpress")?"/tmp/unzipped-wordpress/wordpress":e.fileExists("/tmp/unzipped-wordpress/build")?"/tmp/unzipped-wordpress/build":"/tmp/unzipped-wordpress";e.mv(r,e.documentRoot),!e.fileExists(joinPaths(e.documentRoot,"wp-config.php"))&&e.fileExists(joinPaths(e.documentRoot,"wp-config-sample.php"))&&e.writeFile(joinPaths(e.documentRoot,"wp-config.php"),e.readFileAsText(joinPaths(e.documentRoot,"/wp-config-sample.php")))}const scope=Math.random().toFixed(16);self.postMessage("worker-script-started");let virtualOpfsRoot,virtualOpfsDir,lastOpfsHandle,lastOpfsMountpoint,wordPressAvailableInOPFS=!1;startupOptions.storage==="browser"&&typeof navigator?.storage?.getDirectory<"u"&&(virtualOpfsRoot=await navigator.storage.getDirectory(),virtualOpfsDir=await virtualOpfsRoot.getDirectoryHandle(startupOptions.siteSlug==="wordpress"?startupOptions.siteSlug:"site-"+startupOptions.siteSlug,{create:!0}),lastOpfsHandle=virtualOpfsDir,lastOpfsMountpoint="/wordpress",wordPressAvailableInOPFS=await playgroundAvailableInOpfs(virtualOpfsDir));downloadMonitor.expectAssets({[url$1]:size});const sqliteIntegrationRequest=downloadMonitor.monitorFetch(fetch(url$1));let wordPressRequest=null;if(!wordPressAvailableInOPFS)if(requestedWPVersion.startsWith("http"))wordPressRequest=monitoredFetch(requestedWPVersion);else{const e=getWordPressModuleDetails(startupOptions.wpVersion);downloadMonitor.expectAssets({[e.url]:e.size}),wordPressRequest=monitoredFetch(e.url)}class PlaygroundWorkerEndpoint extends PHPWorker{constructor(t,r,n){super(void 0,t),this.scope=r,this.wordPressVersion=n}async getWordPressModuleDetails(){return{majorVersion:this.wordPressVersion,staticAssetsDirectory:`wp-${this.wordPressVersion.replace("_",".")}`}}async getSupportedWordPressVersions(){return{all:SupportedWordPressVersions,latest:LatestSupportedWordPressVersion}}async resetVirtualOpfs(){if(!virtualOpfsRoot)throw new Error("No virtual OPFS available.");await virtualOpfsRoot.removeEntry(virtualOpfsDir.name,{recursive:!0})}async reloadFilesFromOpfs(){await this.bindOpfs({opfs:lastOpfsHandle,mountpoint:lastOpfsMountpoint})}async bindOpfs(t,r){lastOpfsHandle=t.opfs,lastOpfsMountpoint=t.mountpoint,await bindOpfs({php:this.__internal_getPHP(),onProgress:r,...t})}async journalFSEvents(t,r){return journalFSEvents(this.__internal_getPHP(),t,r)}async replayFSJournal(t){return replayFSJournal(this.__internal_getPHP(),t)}}const apiEndpoint=new PlaygroundWorkerEndpoint(downloadMonitor,scope,startupOptions.wpVersion),[setApiReady,setAPIError]=exposeAPI(apiEndpoint);try{const e=wordPressAvailableInOPFS?{}:{WP_DEBUG:!0,WP_DEBUG_LOG:!0,WP_DEBUG_DISPLAY:!1,AUTH_KEY:randomString(40),SECURE_AUTH_KEY:randomString(40),LOGGED_IN_KEY:randomString(40),NONCE_KEY:randomString(40),AUTH_SALT:randomString(40),SECURE_AUTH_SALT:randomString(40),LOGGED_IN_SALT:randomString(40),NONCE_SALT:randomString(40)},t=wordPressAvailableInOPFS?void 0:new File([await(await wordPressRequest).blob()],"wp.zip"),r=new File([await(await sqliteIntegrationRequest).blob()],"sqlite.zip"),n=await bootWordPress({siteUrl:setURLScope(wordPressSiteUrl,scope).toString(),createPhpRuntime,wordPressZip:t,sqliteIntegrationPluginZip:r,spawnHandler:spawnHandlerFactory,sapiName:startupOptions.sapiName,constants:e,hooks:{async beforeDatabaseSetup(i){virtualOpfsDir&&await bindOpfs({php:i,mountpoint:"/wordpress",opfs:virtualOpfsDir,initialSyncDirection:wordPressAvailableInOPFS?"opfs-to-memfs":"memfs-to-opfs"})}},createFiles:{"/internal/shared/mu-plugins":{"1-playground-web.php":playgroundWebMuPlugin,"playground-includes":{"wp_http_dummy.php":transportDummy,"wp_http_fetch.php":transportFetch}}}});apiEndpoint.__internal_setRequestHandler(n);const s=await n.getPrimaryPhp();await apiEndpoint.setPrimaryPHP(s),setApiReady()}catch(e){throw setAPIError(e),e}
