document.addEventListener('DOMContentLoaded', () => {
    // Initialize functionality
    loadHero();
    loadCategory('trending', 'trending-row');
    loadCategory('topRated', 'top-rated-row');
    loadCategory('action', 'action-row');
    loadCategory('comedy', 'comedy-row');
    initNavbarScrolling();

    // Navigation Logic
    setupNavigation();

    // Feature Logic
    setupProfileInteractions();
    setupPaymentFlow();
    setupPaymentTabs();

    // Global Play Button for Hero
    const heroPlayBtn = document.getElementById('hero-play-btn');
    if (heroPlayBtn) {
        heroPlayBtn.addEventListener('click', () => {
            // Play generic trailer
            openVideoPlayer('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
        });
    }
});

function openVideoPlayer(videoUrl) {
    const modal = document.getElementById('video-modal');
    const container = modal.querySelector('.video-container');

    // Clear previous
    container.innerHTML = `<button class="close-btn"><i data-lucide="x"></i></button>`;

    // Create Video
    const video = document.createElement('video');
    video.src = videoUrl;
    video.controls = true;
    video.autoplay = true;
    video.style.width = '100%';
    video.style.height = '100%';

    container.appendChild(video);

    modal.classList.add('active');

    // Close Logic
    const closeBtn = container.querySelector('.close-btn');
    const closeModal = () => {
        modal.classList.remove('active');
        video.pause();
        video.src = "";
        container.innerHTML = ""; // Cleanup
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Lucide re-render for close icon
    lucide.createIcons();
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view');
    const profileTrigger = document.querySelector('.profile-menu'); // Desktop profile avatar
    const myListLink = document.querySelector('a[href="#mylist"]'); // My List in Navbar

    // My List Handling (Direct link)
    if (myListLink) {
        myListLink.addEventListener('click', (e) => {
            e.preventDefault();
            // Reuse Downloads view style for My List or create new.
            // For now, we'll route to Downloads view but change title
            switchView('downloads-view');
            updateActiveNav('downloads-view');
            const title = document.querySelector('#downloads-view .page-title');
            if (title) title.textContent = "My List";

            // Revert title if we leave? That's complex for this demo, keeping it simple.
        });
    }

    // Handle generic nav items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            if (targetId) {
                // Reset title if going to Downloads explicitly
                if (targetId === 'downloads-view') {
                    const title = document.querySelector('#downloads-view .page-title');
                    if (title) title.textContent = "My Downloads";
                }

                switchView(targetId);
                updateActiveNav(targetId);
            }
        });
    });

    // Handle Profile Avatar click (Desktop)
    if (profileTrigger) {
        profileTrigger.addEventListener('click', () => {
            switchView('profile-view');
            updateActiveNav('profile-view');
        });
    }

    function switchView(targetId) {
        views.forEach(view => {
            if (view.id === targetId) {
                view.classList.remove('hidden');
                setTimeout(() => view.classList.add('active'), 10);
            } else {
                view.classList.add('hidden');
                view.classList.remove('active');
            }
        });

        // Populate search if switching to search view
        if (targetId === 'search-view') {
            loadSearchSuggestions();
            document.getElementById('search-input').focus();
        }
    }

    function updateActiveNav(targetId) {
        navItems.forEach(n => n.classList.remove('active'));
        const matchingItems = document.querySelectorAll(`.nav-item[data-target="${targetId}"]`);
        matchingItems.forEach(m => m.classList.add('active'));
    }
}

function setupPaymentTabs() {
    const tabs = document.querySelectorAll('.pay-tab');
    const methods = document.querySelectorAll('.payment-method-view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update Tab UI
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show Method
            const methodKey = tab.getAttribute('data-method');
            methods.forEach(view => {
                view.classList.remove('active');
                if (view.id === `pay-form-${methodKey}`) {
                    view.classList.add('active');
                }
            });
        });
    });

    // UPI Selection Mock
    const upiItems = document.querySelectorAll('.upi-item');
    const upiDynamic = document.getElementById('upi-dynamic-section');
    const upiDefault = document.getElementById('upi-default-section');
    const selectedAppName = document.getElementById('selected-upi-app-name');
    const upiInputLabel = document.getElementById('upi-input-label');
    const upiInput = document.getElementById('upi-id-input');

    upiItems.forEach(item => {
        item.addEventListener('click', () => {
            upiItems.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');

            // Show Details
            if (upiDefault) upiDefault.style.display = 'none';
            if (upiDynamic) {
                upiDynamic.classList.add('active');

                // Update Text
                const appName = item.getAttribute('data-app');
                if (selectedAppName) selectedAppName.textContent = appName;
                if (upiInputLabel) upiInputLabel.textContent = `Enter ${appName} UPI ID`;
                if (upiInput) {
                    upiInput.placeholder = `username@${appName.toLowerCase().replace(' ', '')}`;
                    upiInput.focus();
                }
            }
        });
    });

    // Crypto Selection Mock
    document.querySelectorAll('.crypto-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.crypto-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle address demo
            const addr = document.querySelector('.wallet-address span');
            if (btn.textContent.includes("BTC")) addr.textContent = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
            else addr.textContent = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
        });
    });
}

function loadSearchSuggestions() {
    const container = document.getElementById('search-results');
    if (container.children.length > 0) return; // Already loaded

    // Mix content for suggestions
    const allContent = [...mockData.trending, ...mockData.topRated, ...mockData.action];

    allContent.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.innerHTML = `<img src="${item.image}" alt="${item.title}" loading="lazy">`;
        container.appendChild(card);
    });
}

function setupInteractions() {
    const playBtn = document.querySelector('.btn-primary');
    const modal = document.getElementById('video-modal');
    const closeBtn = document.getElementById('close-video');
    const videoFrame = document.getElementById('video-frame');
    // Using simple Interstellar trailer or similar
    const videoUrl = "https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&rel=0";

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            playBtn.innerHTML = `<i data-lucide="loader" class="icon fill-icon spin"></i> Loading...`;
            lucide.createIcons();

            setTimeout(() => {
                playBtn.innerHTML = `<i data-lucide="play" class="icon fill-icon"></i> Play`;
                lucide.createIcons();

                modal.classList.add('active');
                videoFrame.src = videoUrl;
                document.body.style.overflow = 'hidden';
            }, 800);
        });
    }

    const closeModal = () => {
        modal.classList.remove('active');
        videoFrame.src = "";
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

function loadHero() {
    const heroData = mockData.hero;
    const titleEl = document.getElementById('hero-title');
    const descEl = document.getElementById('hero-desc');
    const bgEl = document.getElementById('hero-bg');
    const videoBg = document.querySelector('.hero-bg-video');

    if (titleEl) titleEl.textContent = heroData.title;
    if (descEl) descEl.textContent = heroData.description;

    if (bgEl) {
        bgEl.style.backgroundImage = `url('${heroData.image}')`;
    } else if (videoBg) {
        videoBg.poster = heroData.image;
    }
}

function loadCategory(categoryKey, containerId) {
    const container = document.getElementById(containerId);
    const items = mockData[categoryKey];

    if (!items || !container) return;

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'media-card';
        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy">
        `;

        // Add click effect
        card.addEventListener('click', () => {
            console.log(`Open details for: ${item.title}`);
            // In a real app, this would open a modal or navigate to a page
        });

        container.appendChild(card);
    });
}

function initNavbarScrolling() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}



function setupProfileInteractions() {
    const profiles = document.querySelectorAll('.profile-item');
    const accountSection = document.querySelector('.account-section');
    const manageBtn = document.querySelector('.manage-btn');

    // Profile Selection
    profiles.forEach(p => {
        p.addEventListener('click', () => {
            if (p.classList.contains('add-profile')) {
                alert("Add Profile feature would open a form here.");
                return;
            }

            // Set active
            profiles.forEach(i => i.classList.remove('active'));
            p.classList.add('active');

            // Update global avatar
            const newSrc = p.querySelector('img').src;
            const newName = p.querySelector('span').textContent;

            document.querySelectorAll('.avatar').forEach(a => a.src = newSrc);

            // If Kids profile, maybe filter content (Part of a real logic, mocked here)
            if (p.getAttribute('data-id') === 'kids') {
                alert(`Switched to ${newName} Profile. Content filtered for kids.`);
            } else {
                alert(`Switched to ${newName} Profile.`);
            }
        });
    });

    // Manage Account Toggle (Simple toggle for demo)
    if (manageBtn) {
        manageBtn.addEventListener('click', () => {
            // In a real app this might go to a different view, here we just scroll/focus the settings
            accountSection.scrollIntoView({ behavior: 'smooth' });
            document.getElementById('account-name').focus();
        });
    }
}

function setupPaymentFlow() {
    const planButtons = document.querySelectorAll('.plan-select-btn');
    const paymentModal = document.getElementById('payment-modal');
    const closeModalBtn = paymentModal.querySelector('.close-modal');
    const payForm = document.getElementById('payment-form');

    // Open Modal with specific plan details
    planButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const planName = btn.getAttribute('data-plan');
            const planPrice = btn.getAttribute('data-price');

            document.getElementById('pay-plan-name').textContent = planName;
            document.getElementById('pay-plan-price').textContent = `${planPrice}/mo`;

            paymentModal.classList.add('active');
        });
    });

    // Close Modal
    const closePayment = () => {
        paymentModal.classList.remove('active');
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closePayment);
    paymentModal.addEventListener('click', (e) => {
        if (e.target === paymentModal) closePayment();
    });

    // Handle Payment Submission
    if (payForm) {
        payForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = payForm.querySelector('.pay-btn');
            const originalText = btn.textContent;

            // Loading state
            btn.textContent = "Processing...";
            btn.disabled = true;

            setTimeout(() => {
                // Success state
                btn.textContent = "Success!";
                btn.style.backgroundColor = "#46d369";

                setTimeout(() => {
                    closePayment();

                    // Reset button
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = "";

                    // Update Account UI
                    const planName = document.getElementById('pay-plan-name').textContent;
                    document.getElementById('current-plan-name').textContent = planName;

                    alert("Payment Successful! Your subscription is now active.");

                    // Reset form
                    payForm.reset();
                }, 1000);
            }, 2000);
        });
    }
}

// Add spinning animation style dynamically
const style = document.createElement('style');
style.innerHTML = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
