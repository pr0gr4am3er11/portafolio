
const API_URL = 'https://portfolio-api-three-black.vercel.app/api/v1';


const USER_ID = ''; 

let projects = [];


document.addEventListener('DOMContentLoaded', () => {
    console.log('Portafolio cargado');
    loadProjects();
    setupEventListeners();
    animateOnScroll();
});

function setupEventListeners() {
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProjectModal();
            }
        });
    }

    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProjectModal();
        }
    });

    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                document.querySelector('.nav-links')?.classList.remove('active');
            }
        });
    });
}


function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}


async function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '<div class="loading-message">⏳ Cargando proyectos...</div>';

    try {
        
        const url = USER_ID 
            ? `${API_URL}/projects/user/${USER_ID}` 
            : `${API_URL}/projects/public`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        
        if (response.status === 404) {
            
            const altResponse = await fetch(`${API_URL}/projects`, {
                method: 'GET'
            });
            
            if (altResponse.ok) {
                const data = await altResponse.json();
                projects = Array.isArray(data) ? data : [];
                displayProjects();
                updateProjectCount();
                return;
            }
            
            
            loadDemoProjects();
            return;
        }

        if (response.ok) {
            const data = await response.json();
            projects = Array.isArray(data) ? data : [];
            displayProjects();
            updateProjectCount();
        } else {
            loadDemoProjects();
        }
    } catch (error) {
        console.error('Error cargando proyectos:', error);
        loadDemoProjects();
    }
}

function loadDemoProjects() {
    projects = [];
    displayProjects();
    updateProjectCount();
}

function displayProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="empty-message">
                📭 No hay proyectos disponibles aún.
            </div>
        `;
        return;
    }

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card" onclick="openProjectModal('${project._id}')">
            ${project.images && project.images.length > 0 
                ? `<img src="${escapeHtml(project.images[0])}" alt="${escapeHtml(project.title)}" class="project-image" onerror="this.outerHTML='<div class=\\'project-no-image\\'>🚀</div>'">`
                : '<div class="project-no-image">🚀</div>'
            }
            <div class="project-content">
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(truncateText(project.description, 100))}</p>
                ${project.technologies && project.technologies.length > 0 ? `
                    <div class="project-technologies">
                        ${project.technologies.slice(0, 4).map(tech => `
                            <span class="tech-tag">${escapeHtml(tech)}</span>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="project-links">
                    <span class="project-link">👁️ VER MÁS</span>
                </div>
            </div>
        </div>
    `).join('');
}

function updateProjectCount() {
    const projectCount = document.getElementById('projectCount');
    if (projectCount) {
        projectCount.textContent = projects.length;
    }
}


function openProjectModal(projectId) {
    const project = projects.find(p => p._id === projectId);
    if (!project) return;

    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');

    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
        ${project.images && project.images.length > 0 
            ? `<img src="${escapeHtml(project.images[0])}" alt="${escapeHtml(project.title)}" class="modal-project-image" onerror="this.style.display='none'">`
            : ''
        }
        <div class="modal-project-content">
            <h2>${escapeHtml(project.title)}</h2>
            <p>${escapeHtml(project.description)}</p>
            
            ${project.technologies && project.technologies.length > 0 ? `
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="font-family: 'Bangers', cursive; font-size: 1.2rem; margin-bottom: 0.75rem; color: #4ECDC4;">🛠️ TECNOLOGÍAS</h4>
                    <div class="project-technologies">
                        ${project.technologies.map(tech => `
                            <span class="tech-tag">${escapeHtml(tech)}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="project-links" style="margin-top: 1.5rem;">
                ${project.repository ? `
                    <a href="${escapeHtml(project.repository)}" target="_blank" class="project-link">
                        📦 VER REPOSITORIO
                    </a>
                ` : ''}
                ${project.liveUrl ? `
                    <a href="${escapeHtml(project.liveUrl)}" target="_blank" class="project-link">
                        🌐 VER EN VIVO
                    </a>
                ` : ''}
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}


function handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !email || !message) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }

    
    showNotification('¡Mensaje enviado correctamente! Te contactaré pronto.', 'success');
    e.target.reset();

    
    console.log('Mensaje de contacto:', { name, email, message });
}


function showNotification(message, type = 'info') {
    
    let container = document.getElementById('notificationContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; max-width: 400px;';
        document.body.appendChild(container);
    }

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };

    const colors = {
        success: '#4ECDC4',
        error: '#FF6B6B',
        warning: '#FFE66D',
        info: '#4ECDC4'
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
        background: white;
        border: 5px solid ${colors[type]};
        padding: 1rem 1.5rem;
        box-shadow: 5px 5px 0 rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <span style="font-size: 1.5rem;">${icons[type]}</span>
        <span style="font-weight: 700;">${message}</span>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}


function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    
    document.querySelectorAll('.project-card, .skill-card, .comic-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.5s ease';
        observer.observe(el);
    });
}


function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}


window.toggleMenu = toggleMenu;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;