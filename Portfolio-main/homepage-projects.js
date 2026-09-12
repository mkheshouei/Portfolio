(() => {
  const showcase = document.querySelector('.bench');
  const featured = document.querySelector('.featured-grid');
  if (!showcase || !featured) return;

  // Only projects with real preview media belong in the homepage rotation.
  const projects = [
    { id: 'flexure', title: 'Spherical flexure joint', category: 'Compliant mechanism', tools: 'Fusion 360 / Mechanical design', kind: 'video', src: 'assets/spherical-flexure-joint.mov', description: 'A joint that moves through material flexibility instead of conventional bearings or hinges.' },
    { id: 'robot', title: 'Vision-guided robot arm', category: 'Robotics', tools: 'Computer vision / Camera calibration', kind: 'video', src: 'assets/robot-arm.mov', description: 'A camera finds an object by color and maps its position to table coordinates so the arm can pick it up.' },
    { id: 'fidget', title: 'NFC fidget toy', category: 'Product design', tools: 'FDM printing / Embedded NFC', kind: 'image', src: 'assets/nfc-fidget-toy-1.jpg', description: 'A printed fidget toy with a two-position spring mechanism and an NFC tag inside.' },
    { id: 'reverse', title: 'Reverse engineering report', category: 'Reverse engineering', tools: 'ME 1212 / Technical drawings', kind: 'video', src: 'assets/reverse-engineering-assembly.mp4', description: 'A team teardown of a sander, including component drawings, dimensional analysis, and an assembly animation.' },
    { id: 'radar', title: 'Ultrasonic radar scanner', category: 'Electronics', tools: 'Arduino / Ultrasonic sensing', kind: 'video', src: 'assets/radar-scanner.mov', description: 'A servo sweeps an ultrasonic sensor to measure nearby objects, with a buzzer for alerts and a custom enclosure.' },
    { id: 'imitation', title: 'Robot imitation system', category: 'Robotics', tools: 'Motion mapping / Demonstration', kind: 'video', src: 'assets/robot-imitation.mov', description: 'A larger robot follows the movement of a smaller robot by mapping motion between the two.' }
  ];
  let previous = [];
  try {
    const saved = JSON.parse(sessionStorage.getItem('mk-home-projects') || '[]');
    if (Array.isArray(saved)) previous = saved;
  } catch { /* Randomization also works when storage is unavailable. */ }
  const remaining = [...projects];
  const selected = [];
  for (let slot = 0; slot < 3; slot++) {
    const candidates = remaining.filter(project => project.id !== previous[slot]);
    const project = candidates[Math.floor(Math.random() * candidates.length)];
    selected.push(project);
    remaining.splice(remaining.indexOf(project), 1);
  }
  try { sessionStorage.setItem('mk-home-projects', JSON.stringify(selected.map(project => project.id))); } catch {}

  const media = (project, controls = false) => project.kind === 'image'
    ? `<img src="${project.src}" alt="${project.title}" decoding="async">`
    : `<video muted playsinline loop preload="metadata" ${controls ? 'controls' : ''} aria-label="${project.title}"><source src="${project.src}"></video>`;
  const hero = selected[0];
  const visual = showcase.querySelector('.bench-visual');
  visual.querySelector('video, img')?.remove();
  visual.insertAdjacentHTML('afterbegin', media(hero, true));
  showcase.querySelector('.live-label').textContent = hero.kind === 'image' ? 'PROJECT PHOTO' : 'PROJECT VIDEO';
  showcase.querySelector('.bench-caption .micro').textContent = hero.category.toUpperCase();
  showcase.querySelector('h2').textContent = hero.title;
  const link = showcase.querySelector('.bench-caption > a');
  link.href = `projects.html#${hero.id}`;
  link.setAttribute('aria-label', `Explore ${hero.title}`);
  featured.innerHTML = selected.slice(1).map(project => `
    <a class="work-card" href="projects.html#${project.id}">
      <div class="work-image">${media(project)}<span class="image-number">${project.category.toUpperCase()}</span><span class="card-arrow">↗</span></div>
      <div class="work-copy"><span class="micro">${project.tools.toUpperCase()}</span><h3>${project.title}</h3><p>${project.description}</p></div>
    </a>`).join('');
})();
