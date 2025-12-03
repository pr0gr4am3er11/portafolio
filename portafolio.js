const ITSON_ID = '252859';  
const API_BASE = 'https://portfolio-api-three-black.vercel.app/api/v1';

let projects = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Portafolio cargado');
    console.log('🆔 ITSON ID configurado:', ITSON_ID);
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
    const statNumber = document.getElementById('projectCount');
    
    try {
        console.log(`🔍 Cargando proyectos para ITSON ID: ${ITSON_ID}`);
        
        const response = await fetch(`${API_BASE}/publicProjects/${ITSON_ID}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        projects = Array.isArray(data) ? data : [];
        
        console.log('📦 Proyectos cargados:', projects);
        
        if (statNumber && projects.length > 0) {
            statNumber.setAttribute('data-target', projects.length);
            statNumber.textContent = projects.length;
        }
        
        if (!projects || projects.length === 0) {
            projectsGrid.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 3rem 2rem;
                    background: white;
                    border: 5px solid #4ECDC4;
                    box-shadow: 5px 5px 0 rgba(0,0,0,0.3);
                    border-radius: 10px;
                ">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">📁</div>
                    <h3 style="font-family: 'Bangers', cursive; font-size: 1.5rem; margin-bottom: 1rem; color: #333;">
                        No hay proyectos públicos aún
                    </h3>
                    <p style="color: #666; line-height: 1.6; margin-bottom: 1rem;">
                        Los proyectos se mostrarán aquí una vez que sean agregados desde el backoffice.
                    </p>
                    <p style="font-size: 1rem; margin-top: 1.5rem; opacity: 0.7;">
                        ITSON ID configurado: <strong style="color: #4ECDC4;">${ITSON_ID}</strong>
                    </p>
                </div>
            `;
            return;
        }
        
        renderProjects(projects);
        
    } catch (error) {
        console.error('❌ Error al cargar proyectos:', error);
        projectsGrid.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 3rem 2rem;
                background: white;
                border: 5px solid #FF6B6B;
                box-shadow: 5px 5px 0 rgba(0,0,0,0.3);
                border-radius: 10px;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h3 style="font-family: 'Bangers', cursive; font-size: 1.5rem; margin-bottom: 1rem; color: #FF6B6B;">
                    Error al cargar proyectos
                </h3>
                <p style="color: #666; margin-bottom: 1rem;">${error.message}</p>
                <p style="font-size: 1rem; margin-top: 1.5rem; opacity: 0.7; line-height: 1.6;">
                    Verifica que tu ITSON ID (<strong style="color: #FF6B6B;">${ITSON_ID}</strong>) sea correcto<br>
                    y que tengas proyectos públicos en el backoffice.
                </p>
                <button 
                    onclick="loadProjects()" 
                    style="
                        margin-top: 1.5rem;
                        background: #4ECDC4;
                        color: white;
                        border: 3px solid black;
                        padding: 0.75rem 1.5rem;
                        font-family: 'Bangers', cursive;
                        font-size: 1.1rem;
                        cursor: pointer;
                        box-shadow: 3px 3px 0 rgba(0,0,0,0.3);
                        border-radius: 5px;
                    "
                >
                    🔄 REINTENTAR
                </button>
            </div>
        `;
    }
}

function renderProjects(projectsList) {
    const projectsGrid = document.getElementById('projectsGrid');
    
    projectsGrid.innerHTML = projectsList.map(project => `
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
        border-radius: 5px;
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
window.loadProjects = loadProjects;