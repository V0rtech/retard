// Firebase configuration - YOUR ACTUAL CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCow-X3eG53gws-GBevPUkJdcLcR10T4js",
  authDomain: "retard-coin-testimonials.firebaseapp.com",
  projectId: "retard-coin-testimonials",
  storageBucket: "retard-coin-testimonials.firebasestorage.app",
  messagingSenderId: "371311054734",
  appId: "1:371311054734:web:79a23ce336f48249a19edf"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global variables
let testimonials = [];
let currentPage = 0;
const testimonialsPerPage = 4;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 RETARD COIN - JavaScript Loaded with Firebase!');
    loadTestimonialsFromFirebase();
    
    // Real-time listener for new testimonials
    const q = query(collection(db, 'testimonials'), orderBy('timestamp', 'desc'));
    onSnapshot(q, (snapshot) => {
        console.log('📡 Firebase update received');
        loadTestimonialsFromFirebase();
    });
});

// Load testimonials from Firebase
async function loadTestimonialsFromFirebase() {
    try {
        console.log('📡 Loading testimonials from Firebase...');
        const q = query(collection(db, 'testimonials'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        testimonials = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            testimonials.push({
                username: data.username,
                message: data.message,
                color: data.color,
                timestamp: data.timestamp
            });
        });
        
        console.log('✅ Loaded', testimonials.length, 'testimonials from Firebase');
        
        // If no testimonials exist, add default ones
        if (testimonials.length === 0) {
            await addDefaultTestimonials();
        }
        
        displayTestimonials();
    } catch (error) {
        console.error('❌ Error loading testimonials:', error);
        // Fallback to local testimonials if Firebase fails
        loadDefaultTestimonials();
        displayTestimonials();
    }
}

// Add default testimonials to Firebase (only run once)
async function addDefaultTestimonials() {
    console.log('📝 Adding default testimonials to Firebase...');
    
    const defaultTestimonials = [
        { username: "RichKid2003", message: "this site made me so rich i bought NASA and renamed it to RETARD-SA 🚀💰", color: "#9400d3" },
        { username: "DiamondFlex420", message: "THIS COIN changed my life, now I own 47 wheelchairs in my wheelchair account", color: "#ff4500" },
        { username: "MoneyMagnet69", message: "I printed this website and used it as wallpaper in my group home", color: "#ff1493" },
        { username: "BallSoHard", message: "Instructions unclear: accidentally became the CEO of Special Olympics", color: "#ffd700" },
        { username: "CryptoKing88", message: "Used this site as inspiration and now I own 15 mobility scooters shaped like dollar signs ♿💰", color: "#00ff00" },
        { username: "FlexMaster2024", message: "Bought my own disability center after visiting this site, now I drool money legally", color: "#ff69b4" }
    ];
    
    for (const testimonial of defaultTestimonials) {
        try {
            await addDoc(collection(db, 'testimonials'), {
                ...testimonial,
                timestamp: Date.now()
            });
        } catch (error) {
            console.error('❌ Error adding default testimonial:', error);
        }
    }
    
    console.log('✅ Default testimonials added to Firebase');
}

// Fallback local testimonials if Firebase fails
function loadDefaultTestimonials() {
    console.log('⚠️ Using local testimonials (Firebase unavailable)');
    testimonials = [
        { username: "RichKid2003", message: "this site made me so rich i bought NASA and renamed it to RETARD-SA 🚀💰", color: "#9400d3" },
        { username: "DiamondFlex420", message: "THIS COIN changed my life, now I own 47 wheelchairs in my wheelchair account", color: "#ff4500" },
        { username: "MoneyMagnet69", message: "I printed this website and used it as wallpaper in my group home", color: "#ff1493" },
        { username: "BallSoHard", message: "Instructions unclear: accidentally became the CEO of Special Olympics", color: "#ffd700" },
        { username: "CryptoKing88", message: "Used this site as inspiration and now I own 15 mobility scooters shaped like dollar signs ♿💰", color: "#00ff00" },
        { username: "FlexMaster2024", message: "Bought my own disability center after visiting this site, now I drool money legally", color: "#ff69b4" }
    ];
}

// Copy contract address function
function copyToClipboard() {
    console.log('📋 Copy function called');
    const contractAddress = document.getElementById('contractAddress').textContent;
    
    if (contractAddress === "PASTE_YOUR_CONTRACT_ADDRESS_HERE") {
        alert('🤕 ADD YOUR REAL CONTRACT ADDRESS FIRST! 🤕');
        return;
    }
    
    navigator.clipboard.writeText(contractAddress).then(function() {
        alert('🚀 CONTRACT ADDRESS COPIED! TO THE MOON! 🚀');
        
        // Flash effect when copied
        document.getElementById('contractAddress').style.background = '#00ff00';
        setTimeout(() => {
            document.getElementById('contractAddress').style.background = 'rgba(0, 0, 0, 0.8)';
        }, 500);
    }).catch(function() {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = contractAddress;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('🚀 CONTRACT ADDRESS COPIED! TO THE MOON! 🚀');
    });
}

// Display testimonials with pagination
function displayTestimonials() {
    console.log('📄 Displaying testimonials, page:', currentPage + 1);
    
    const container = document.getElementById('testimonials-container');
    if (!container) {
        console.error('❌ Testimonials container not found!');
        return;
    }
    
    const start = currentPage * testimonialsPerPage;
    const end = start + testimonialsPerPage;
    const pageTestimonials = testimonials.slice(start, end);
    
    console.log('📄 Showing testimonials', start + 1, 'to', Math.min(end, testimonials.length), 'of', testimonials.length);
    
    container.innerHTML = '';
    
    pageTestimonials.forEach(testimonial => {
        const p = document.createElement('p');
        p.innerHTML = `<strong style="color: ${testimonial.color};">${testimonial.username}:</strong> "${testimonial.message}"`;
        container.appendChild(p);
    });
    
    updatePaginationControls();
    console.log('✅ Testimonials displayed successfully');
}

// Update pagination controls
function updatePaginationControls() {
    const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (pageInfo) pageInfo.textContent = `PAGE ${currentPage + 1} OF ${totalPages}`;
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
        prevBtn.style.opacity = currentPage === 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages - 1;
        nextBtn.style.opacity = currentPage === totalPages - 1 ? '0.5' : '1';
    }
}

// Navigation functions
function previousPage() {
    if (currentPage > 0) {
        currentPage--;
        displayTestimonials();
    }
}

function nextPage() {
    const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
    if (currentPage < totalPages - 1) {
        currentPage++;
        displayTestimonials();
    }
}

// Add new flex to Firebase
async function addYourFlex() {
    console.log('💰 Add Your Flex function called!');
    
    try {
        const username = prompt('🤕 What\'s your retard username? 🤕', 'RetardKing' + Math.floor(Math.random() * 1000));
        if (!username || username.trim() === '') {
            console.log('❌ Username cancelled or empty');
            return;
        }
        
        const message = prompt('🚀 Share your retard flex story! 🚀', '');
        if (!message || message.trim() === '') {
            console.log('❌ Message cancelled or empty');
            return;
        }
        
        console.log('✅ Got username:', username, 'and message:', message);
        
        // Random color for the new testimonial
        const colors = ['#9400d3', '#ff4500', '#ff1493', '#ffd700', '#00ff00', '#ff69b4', '#00ffff', '#ff6347'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const newTestimonial = {
            username: username,
            message: message,
            color: randomColor,
            timestamp: Date.now()
        };
        
        // Add to Firebase
        console.log('📡 Adding testimonial to Firebase...');
        await addDoc(collection(db, 'testimonials'), newTestimonial);
        console.log('✅ Testimonial added to Firebase successfully');
        
        // Show success message
        alert('🎉 YOUR FLEX HAS BEEN ADDED TO THE HALL OF FAME! 🎉\n💰 WELCOME TO THE RETARD CLUB! 💰\n🌍 IT\'S NOW LIVE FOR EVERYONE TO SEE! 🌍');
        
        // Firebase listener will automatically update the display
        currentPage = 0; // Go to first page to see new testimonial
        
    } catch (error) {
        console.error('❌ Error in addYourFlex:', error);
        alert('🚨 ERROR ADDING FLEX! Check console for details.\n' + error.message);
    }
}

// Make functions globally accessible
window.addYourFlex = addYourFlex;
window.copyToClipboard = copyToClipboard;
window.previousPage = previousPage;
window.nextPage = nextPage;

// Add more chaos effects
setInterval(() => {
    // Random color flash
    if (Math.random() < 0.05) {
        document.body.style.filter = 'hue-rotate(' + Math.random() * 360 + 'deg) saturate(200%)';
        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 300);
    }
}, 1000);

// Add random luxury items
function addRandomLuxury() {
    const luxuries = ['💰', '🧑‍🦼', '🤕', '🥴', '🏖️', '🛥️', '🏠', '💸', '♿'];
    const luxury = document.createElement('div');
    luxury.textContent = luxuries[Math.floor(Math.random() * luxuries.length)];
    luxury.className = 'luxury-item';
    luxury.style.top = Math.random() * 80 + '%';
    luxury.style.left = Math.random() * 90 + '%';
    document.body.appendChild(luxury);
    
    setTimeout(() => {
        luxury.remove();
    }, 5000);
}
function buyNow() {
    const buyLink = "pump.fun";
    window.open(buyLink, '_blank');
}

function openTwitter() {
    const twitterUrl = "https://x.com/i/communities/1953159479437963394/";
    window.open(twitterUrl, '_blank');
}

function openDexScreener() {
    const dexUrl = "https://dexscreener.com";
    window.open(dexUrl, '_blank');
}

window.buyNow = buyNow;
window.openTwitter = openTwitter;
window.openDexScreener = openDexScreener;
setInterval(addRandomLuxury, 2000);