import test from 'node:test';
import assert from 'node:assert/strict';
import {createResumeJob,disableResumeUsageAnalytics} from '../lib/resume-generator/client';
test('resume opt-out reaches the server even when browser storage is blocked',async()=>{
 const original=globalThis.fetch;
 const originalWindow=Object.getOwnPropertyDescriptor(globalThis,'window');
 const originalNavigator=Object.getOwnPropertyDescriptor(globalThis,'navigator');
 try {
  Object.defineProperty(globalThis,'window',{configurable:true,value:{localStorage:{getItem(){throw Error();},setItem(){throw Error();}}}});
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{doNotTrack:'0'}});
  let flag:unknown;
  globalThis.fetch=async(_url,init)=>{flag=new Headers(init?.headers).get('X-Daniel-Analytics-Disabled');return new Response(JSON.stringify({jobId:'fixture',status:'queued'}),{status:202});};
  disableResumeUsageAnalytics();
  await createResumeJob({jobDescription:{text:'Synthetic fixture job description'}});
  assert.equal(flag,'true');
 } finally {globalThis.fetch=original;if(originalWindow)Object.defineProperty(globalThis,'window',originalWindow);else Reflect.deleteProperty(globalThis,'window');if(originalNavigator)Object.defineProperty(globalThis,'navigator',originalNavigator);else Reflect.deleteProperty(globalThis,'navigator');}
});
