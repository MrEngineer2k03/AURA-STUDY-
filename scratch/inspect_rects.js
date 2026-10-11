const http = require('http');

http.get('http://127.0.0.1:9222/json', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const tabs = JSON.parse(data);
    const auraTab = tabs.find(t => t.url.includes('5174'));
    const ws = new WebSocket(auraTab.webSocketDebuggerUrl);
    ws.onopen = () => {
      const code = `(() => {
        const daily = document.querySelector('.daily-challenge-card.mobile-only');
        const countMeta = daily?.querySelector('.daily-count-meta');
        const progressTrack = daily?.querySelector('.daily-progress-track');
        const rewardsRow = daily?.querySelector('.daily-rewards-chips-row');
        const folders = document.querySelector('.study-folders-panel');
        const events = document.querySelector('.upcoming-events-card');
        
        return JSON.stringify({
          dailyBox: daily ? daily.getBoundingClientRect() : null,
          countMeta: countMeta ? {
            rect: countMeta.getBoundingClientRect(),
            display: getComputedStyle(countMeta).display,
            visibility: getComputedStyle(countMeta).visibility,
            color: getComputedStyle(countMeta).color
          } : null,
          progressTrack: progressTrack ? {
            rect: progressTrack.getBoundingClientRect(),
            display: getComputedStyle(progressTrack).display,
            height: getComputedStyle(progressTrack).height
          } : null,
          rewardsRow: rewardsRow ? {
            rect: rewardsRow.getBoundingClientRect(),
            display: getComputedStyle(rewardsRow).display
          } : null,
          foldersBox: folders ? folders.getBoundingClientRect() : null,
          foldersHeight: folders ? getComputedStyle(folders).height : null,
          eventsBox: events ? events.getBoundingClientRect() : null,
          eventsHeight: events ? getComputedStyle(events).height : null
        }, null, 2);
      })()`;
      
      ws.send(JSON.stringify({
        id: 1,
        method: 'Runtime.evaluate',
        params: { expression: code }
      }));
    };
    ws.onmessage = e => {
      console.log(JSON.parse(e.data).result.result.value);
      process.exit(0);
    };
  });
});
