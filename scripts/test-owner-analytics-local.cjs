const {spawn,spawnSync}=require('node:child_process');
const fs=require('node:fs');const path=require('node:path');const net=require('node:net');const http=require('node:http');const {randomBytes,createHash}=require('node:crypto');const assert=require('node:assert/strict');
// Optional native-PostgreSQL integration harness; never loads application env files.
const options=Object.fromEntries(process.argv.slice(2).map(value=>{const match=/^--(postgres-bin|pg-module|output)=(.+)$/.exec(value);assert.ok(match,'Use --postgres-bin=PATH --pg-module=PATH [--output=PATH]');return [match[1],match[2]];}));
assert.ok(options['postgres-bin']&&options['pg-module'],'Supply existing PostgreSQL binaries and the official pg client module; this script installs nothing.');
const repo=path.resolve(__dirname,'..');
const root=options.output?path.resolve(options.output):fs.mkdtempSync(path.join(require('node:os').tmpdir(),'portfolio-owner-analytics-'));
fs.mkdirSync(root,{recursive:true,mode:0o700});
const {Client}=require(path.resolve(options['pg-module']));
const native=path.resolve(options['postgres-bin']);
const version=spawnSync(path.join(native,'postgres'),['--version'],{encoding:'utf8'});assert.equal(version.status,0);assert.match(version.stdout,/PostgreSQL\) 17\./,'Use PostgreSQL major 17 to match the verified production target.');
const runId=new Date().toISOString().replace(/[^0-9]/g,'')+'_'+randomBytes(4).toString('hex');
const run=path.join(root,'runs',runId);fs.mkdirSync(run,{recursive:true,mode:0o700});
const dbName='owner_traffic_validation_'+runId;assert.match(dbName,/^owner_traffic_validation_[0-9_a-f]+$/);
const cleanEnv=Object.fromEntries(Object.entries(process.env).filter(([k])=>['PATH','HOME','TMPDIR','TMP','TEMP','LANG','LC_ALL','USER','SHELL'].includes(k)));
const receipt={startedAt:new Date().toISOString(),runId,mode:'native-postgresql-through-real-neon-driver-over-loopback-http',syntheticOnly:true,productionConnections:0,providerCalls:0,requests:0,batches:0,queries:0,errors:[],migration007Sha256:createHash('sha256').update(fs.readFileSync(path.join(repo,'migrations/007_analytics_owner_identities.sql'))).digest('hex')};
function save(){fs.writeFileSync(path.join(run,'receipt.json'),JSON.stringify(receipt,null,2)+'\n',{mode:0o600});fs.writeFileSync(path.join(root,'latest-run.json'),JSON.stringify({run,runId},null,2)+'\n');}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function freePort(){const server=net.createServer();await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});const port=server.address().port;await new Promise(resolve=>server.close(resolve));return port;}
const rawTypes={getTypeParser:()=>value=>value};
const serial=result=>({command:result.command,rowCount:result.rowCount,fields:result.fields,rows:result.rows,rowAsArray:true});
(async()=>{let pg,server,log,admin,testChild;const clients=new Set();
 const stop=()=>{receipt.interrupted=true;testChild?.kill('SIGTERM');if(pg&&pg.exitCode===null)pg.kill('SIGTERM');};
 process.once('SIGINT',stop);process.once('SIGTERM',stop);
 try{
 const port=await freePort();receipt.pgPort=port;receipt.database=dbName;
 const init=spawnSync(path.join(native,'initdb'),['-D',path.join(run,'cluster'),'-U','fixture_owner','-A','trust','--encoding=UTF8','--no-locale'],{env:cleanEnv,encoding:'utf8'});
 fs.writeFileSync(path.join(run,'initdb.log'),init.stdout+init.stderr);assert.equal(init.status,0,'Disposable initdb must succeed');
 log=fs.openSync(path.join(run,'postgres.log'),'w');pg=spawn(path.join(native,'postgres'),['-D',path.join(run,'cluster'),'-p',String(port),'-c','listen_addresses=127.0.0.1','-c',"unix_socket_directories="],{env:cleanEnv,stdio:['ignore',log,log]});
 let ready=false;
 for(let i=0;i<100;i++){if(pg.exitCode!==null)throw Error('Owned PostgreSQL process exited before readiness');if(fs.readFileSync(path.join(run,'postgres.log'),'utf8').includes('database system is ready to accept connections')){ready=true;break;}await delay(100);}assert.ok(ready,'Owned PostgreSQL readiness');
 const config={host:'127.0.0.1',port,user:'fixture_owner',password:'',ssl:false,connectionTimeoutMillis:5000};admin=new Client({...config,database:'postgres'});await admin.connect();
 receipt.postgresVersion=(await admin.query('SELECT version() AS version')).rows[0].version;await admin.query('CREATE DATABASE "'+dbName+'"');await admin.end();admin=null;
 const connection='postgresql://fixture_owner@127.0.0.1:'+port+'/'+dbName;
 server=http.createServer(async(req,res)=>{
  const answer=(status,value)=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(value));};
  if(req.method!=='POST'||req.url!=='/sql'||req.headers['neon-connection-string']!==connection||req.headers['neon-array-mode']!=='true'||req.headers['neon-raw-text-output']!=='true')return answer(403,{message:'Disposable fixture endpoint only'});
  let body='',client;try{
   for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>1048576)throw Error('Fixture body limit');}
   const value=JSON.parse(body),batch=Array.isArray(value.queries),queries=batch?value.queries:[value];assert.ok(queries.length>0&&queries.length<=64);assert.ok(queries.every(q=>typeof q.query==='string'&&Array.isArray(q.params)));
   client=new Client({...config,database:dbName});clients.add(client);await client.connect();receipt.requests++;if(batch)receipt.batches++;
   if(batch)await client.query('BEGIN');const results=[];
   for(const query of queries){receipt.queries++;results.push(serial(await client.query({text:query.query,values:query.params,rowMode:'array',types:rawTypes})));}
   if(batch)await client.query('COMMIT');answer(200,batch?{results}:results[0]);
  }catch(error){if(client)try{await client.query('ROLLBACK');}catch{}receipt.errors.push({code:error.code??'fixture_error',message:error.message});answer(400,{message:error.message,severity:error.severity,code:error.code,detail:error.detail,hint:error.hint,position:error.position,constraint:error.constraint});}
  finally{if(client){await client.end();clients.delete(client);}save();}
 });
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});const endpoint='http://127.0.0.1:'+server.address().port+'/sql';receipt.httpEndpoint=endpoint;
 const guard=path.join(run,'fetch-guard.cjs');fs.writeFileSync(guard,`const original=globalThis.fetch;globalThis.fetch=(input,init)=>{const value=typeof input==='string'||input instanceof URL?String(input):input.url;if(value!==${JSON.stringify(endpoint)})throw new Error('Non-fixture fetch blocked');return original(input,init);};\n`);
 const env={...cleanEnv,CI:'1',NEXT_TELEMETRY_DISABLED:'1',NODE_ENV:'test',DATABASE_URL:connection,APP_ENV:'validation',DATABASE_BRANCH_NAME:'owner-traffic-validation-20261014',ANALYTICS_DISPOSABLE_LOCAL_TEST:'1',ANALYTICS_OWNER_TRAFFIC_ENABLED:'true',ANALYTICS_TEST_HOST:'127.0.0.1',ANALYTICS_TEST_HTTP_ENDPOINT:endpoint};
 const output=fs.openSync(path.join(run,'integration.log'),'w');const child=testChild=spawn(process.execPath,['--require',guard,'--import','tsx','--test','__tests__/analytics-owner-integration.test.ts'],{cwd:repo,env,stdio:['ignore',output,output]});const timer=setTimeout(()=>{receipt.testTimedOut=true;child.kill('SIGTERM');},120000);receipt.testExitCode=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',resolve);});clearTimeout(timer);fs.closeSync(output);
 const inspect=new Client({...config,database:dbName});clients.add(inspect);await inspect.connect();
 receipt.tables=(await inspect.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")).rows;
 receipt.syntheticCounts=(await inspect.query('SELECT (SELECT count(*)::int FROM analytics_events) AS events,(SELECT count(*)::int FROM analytics_owner_identities) AS owner_identities')).rows[0];
 receipt.constraints=(await inspect.query("SELECT pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE conrelid='analytics_owner_identities'::regclass ORDER BY contype,conname")).rows;
 await inspect.end();clients.delete(inspect);receipt.status=receipt.testExitCode===0?'passed':'failed';assert.equal(receipt.testExitCode,0,'Actual native PostgreSQL integration failed; inspect saved log');
 }catch(error){receipt.status='failed';receipt.failure=error.message;process.exitCode=1;}
 finally{
  for(const client of clients)try{await client.end();}catch{}
  if(admin)try{await admin.end();}catch{}
  if(server)await new Promise(resolve=>server.close(resolve));
  if(pg&&pg.exitCode===null){const ended=new Promise(resolve=>pg.once('exit',resolve));pg.kill('SIGTERM');await ended;receipt.ownedPostgresStopped=true;}
  if(log!==undefined)fs.closeSync(log);process.removeListener('SIGINT',stop);process.removeListener('SIGTERM',stop);receipt.completedAt=new Date().toISOString();save();console.log(JSON.stringify(receipt,null,2));
 }
})();
