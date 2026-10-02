"use client";
import { useEffect, useState } from 'react';
import { disableResumeUsageAnalytics } from '@/lib/resume-generator/client';
export default function ResumeAnalyticsPrivacy() {
  const [off,setOff]=useState(false);
  useEffect(() => { let disabled=navigator.doNotTrack==='1' || (navigator as Navigator & {globalPrivacyControl?:boolean}).globalPrivacyControl===true;
    try { disabled ||= localStorage.getItem('daniel-analytics:disabled')==='true'; } catch { /* preference unavailable */ }
    queueMicrotask(() => setOff(disabled));
  },[]);
  return <p className="text-sm text-slate-500">{off ? 'Resume usage analytics is off.' : <>Usage analytics counts generation starts and completed PDFs without job descriptions or resume content. <button type="button" className="underline" onClick={() => { disableResumeUsageAnalytics(); setOff(true); }}>Turn off</button></>}</p>;
}
