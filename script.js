/**
 * Harsha Vardhan Reddy C — Portfolio Script
 * Interactive logic matching sivaramcharan-portfolio.vercel.app
 */

// Global Sound Controller (Web Audio API)
let soundEnabled = false;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

function playClickSound(freq = 600, duration = 0.04) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio context silent catch
  }
}

// Toggle Sound
function toggleAudio() {
  soundEnabled = !soundEnabled;
  const audioBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');

  if (audioIcon) {
    audioIcon.setAttribute('data-lucide', soundEnabled ? 'volume-2' : 'volume-x');
    if (window.lucide) window.lucide.createIcons();
  }

  showToast(soundEnabled ? 'Audio effects enabled' : 'Audio effects muted');
  if (soundEnabled) playClickSound(880, 0.06);
}

// Smooth Scroll to Section
function scrollToSection(id) {
  playClickSound(520);
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -70;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

// Mobile Nav Toggle
function toggleMobileNav() {
  playClickSound(480);
  const dropdown = document.getElementById('mobileDropdown');
  if (dropdown) {
    dropdown.classList.toggle('hidden');
    const isHidden = dropdown.classList.contains('hidden');
    document.body.style.overflow = isHidden ? '' : 'hidden';
  }
}

// Command Palette Modal
function toggleCmdPalette() {
  playClickSound(580);
  const modal = document.getElementById('cmdPaletteModal');
  const input = document.getElementById('cmdInput');
  if (!modal) return;

  const isHidden = modal.classList.toggle('hidden');
  if (!isHidden && input) {
    setTimeout(() => input.focus(), 100);
  }
}

function jumpToSection(id) {
  toggleCmdPalette();
  setTimeout(() => {
    scrollToSection(id);
  }, 150);
}

// Download Handlers
function downloadResumePDF() {
  playClickSound(640);
  showToast('Downloading Harsha Vardhan Reddy Resume PDF...');
  const a = document.createElement('a');
  a.href = 'Harsha_Vardhan_Reddy_Resume.pdf';
  a.download = 'Harsha_Vardhan_Reddy_Resume.pdf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadCabsAPK() {
  playClickSound(640);
  showToast('Downloading U & I Cabs Android APK (14 MB)...');
  const a = document.createElement('a');
  a.href = 'u-and-i-cabs.apk';
  a.download = 'u-and-i-cabs.apk';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Copy Contact Helper
function copyContact(text) {
  playClickSound(700);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied to clipboard: ${text}`);
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.select();
  try {
    document.execCommand('copy');
    showToast(`Copied: ${text}`);
  } catch (err) {
    showToast(`Contact: ${text}`);
  }
  document.body.removeChild(el);
}

// Toast Notification
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.remove('hidden');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2800);
}

// Filter Skills Tabs
function filterSkills(category) {
  playClickSound(550);
  const tabs = document.querySelectorAll('.skill-tab');
  tabs.forEach(tab => {
    tab.classList.remove('active', 'bg-[#FF4F12]', 'text-white');
    tab.classList.add('bg-[#181E2E]', 'text-slate-300');
  });

  const activeBtn = event ? event.currentTarget : null;
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-[#FF4F12]', 'text-white');
    activeBtn.classList.remove('bg-[#181E2E]', 'text-slate-300');
  }

  const cards = document.querySelectorAll('.skill-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-cat');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
      card.style.opacity = '1';
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });
}

// Lifecycle Init
document.addEventListener('DOMContentLoaded', () => {
  // Lucide Icons init
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Mobile menu button
  const mobileNavBtn = document.getElementById('mobileNavBtn');
  if (mobileNavBtn) {
    mobileNavBtn.addEventListener('click', toggleMobileNav);
  }

  // Audio button listener
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleAudio);
  }

  // Keyboard shortcut for Command Menu (Ctrl+K or Cmd+K) and ESC to close
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleCmdPalette();
    }
    if (e.key === 'Escape') {
      const modal = document.getElementById('cmdPaletteModal');
      if (modal && !modal.classList.contains('hidden')) {
        toggleCmdPalette();
      }
      const dropdown = document.getElementById('mobileDropdown');
      if (dropdown && !dropdown.classList.contains('hidden')) {
        toggleMobileNav();
      }
    }
  });

  // Filter input inside Command Menu
  const cmdInput = document.getElementById('cmdInput');
  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll('#cmdPaletteModal .p-2 > div');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
      });
    });
  }

  // Add click sound to interactive elements
  const interactiveElements = document.querySelectorAll('button, a, .skill-card, .timeline-card');
  interactiveElements.forEach(el => {
    el.addEventListener('click', () => {
      playClickSound(500);
    });
  });

  // Navbar Dynamic Color Switch & ScrollSpy (Sivaram Charan 2-Zone Architecture)
  const navBrandName = document.getElementById('navBrandName');
  const siteNav = document.getElementById('siteNav');
  const heroSection = document.getElementById('hero');
  const audioBtn = document.getElementById('audioToggleBtn');
  const cmdBtn = document.querySelector('button[title^="Command Menu"]');
  const mobileBtn = document.getElementById('mobileNavBtn');
  const navLinkedInBtn = document.getElementById('navLinkedInBtn');

  function updateNavbar() {
    // Home (Hero) = Light (#faf9f7)
    // ALL REMAINING SECTIONS = Black Background (#0b0c10)
    const heroSec = document.getElementById('hero');
    let heroBoundary = window.innerHeight - 80;
    if (heroSec) {
      heroBoundary = heroSec.offsetHeight - 80;
    }
    const isLight = (window.pageYOffset < heroBoundary);
    const isDarkSection = !isLight;

    if (isDarkSection) {
      if (siteNav) {
        siteNav.classList.remove('bg-[#faf9f7]/95', 'lg:bg-[#faf9f7]/85', 'border-black/5');
        siteNav.classList.add('bg-[#0b0c10]/95', 'lg:bg-[#0b0c10]/85', 'border-white/10', 'shadow-2xl');
      }
      if (navBrandName) {
        navBrandName.classList.remove('text-[#1a1a1a]');
        navBrandName.classList.add('text-white');
      }
      if (audioBtn) {
        audioBtn.classList.remove('border-black/10', 'text-[#555]');
        audioBtn.classList.add('border-white/10', 'text-slate-300');
      }
      if (cmdBtn) {
        cmdBtn.classList.remove('border-black/10', 'text-[#555]');
        cmdBtn.classList.add('border-white/10', 'text-slate-300');
      }
      if (mobileBtn) {
        mobileBtn.classList.remove('text-[#1a1a1a]');
        mobileBtn.classList.add('text-white');
      }
      if (navLinkedInBtn) {
        navLinkedInBtn.classList.remove('border-black/10', 'text-[#555]');
        navLinkedInBtn.classList.add('border-white/10', 'text-slate-300');
      }
    } else {
      if (siteNav) {
        siteNav.classList.remove('bg-[#0b0c10]/95', 'lg:bg-[#0b0c10]/85', 'border-white/10', 'shadow-2xl');
        siteNav.classList.add('bg-[#faf9f7]/95', 'lg:bg-[#faf9f7]/85', 'border-black/5');
      }
      if (navBrandName) {
        navBrandName.classList.remove('text-white');
        navBrandName.classList.add('text-[#1a1a1a]');
      }
      if (audioBtn) {
        audioBtn.classList.remove('border-white/10', 'text-slate-300');
        audioBtn.classList.add('border-black/10', 'text-[#555]');
      }
      if (cmdBtn) {
        cmdBtn.classList.remove('border-white/10', 'text-slate-300');
        cmdBtn.classList.add('border-black/10', 'text-[#555]');
      }
      if (mobileBtn) {
        mobileBtn.classList.remove('text-white');
        mobileBtn.classList.add('text-[#1a1a1a]');
      }
      if (navLinkedInBtn) {
        navLinkedInBtn.classList.remove('border-white/10', 'text-slate-300');
        navLinkedInBtn.classList.add('border-black/10', 'text-[#555]');
      }
    }

    // ScrollSpy for Nav Links
    const sections = ['hero', 'about', 'projects', 'skills', 'experience', 'contact'];
    let currentSection = 'hero';
    const scrollPos = window.pageYOffset + 200;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById(sections[i]);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset;
        if (top <= scrollPos) {
          currentSection = sections[i];
          break;
        }
      }
    }

    const navLinks = document.querySelectorAll('#navLinks .nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isCurrent = (href === `#${currentSection}`);
      const indicator = link.querySelector('.nav-indicator');

      if (isCurrent) {
        link.classList.add(isDarkSection ? 'text-white' : 'text-[#1a1a1a]', 'font-semibold');
        link.classList.remove(isDarkSection ? 'text-slate-400' : 'text-[#666]');
        if (!indicator) {
          const span = document.createElement('span');
          span.className = 'nav-indicator absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF4F12] rounded-full';
          link.appendChild(span);
        }
      } else {
        link.classList.remove('text-white', 'text-[#1a1a1a]', 'font-semibold');
        link.classList.add(isDarkSection ? 'text-slate-400' : 'text-[#666]');
        if (indicator) {
          indicator.remove();
        }
      }
    });

    // About Section Subnav ScrollSpy
    const aboutSubSections = ['about-intro', 'about-journey', 'about-focus', 'about-athletics'];
    let currentAboutSub = '';
    aboutSubSections.forEach(subId => {
      const el = document.getElementById(subId);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 300 && rect.bottom >= 100) {
          currentAboutSub = subId;
        }
      }
    });

    if (currentAboutSub) {
      const subItems = document.querySelectorAll('.about-nav-item');
      subItems.forEach(item => {
        const onclickAttr = item.getAttribute('onclick') || '';
        if (onclickAttr.includes(currentAboutSub)) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
});
