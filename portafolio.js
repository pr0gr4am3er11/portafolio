const API_URL = 'https://portfolio-api-three-black.vercel.app/api/v1';


const USER_ID = '692b84a799fcc4c188c1e862'; 

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


// ⭐ FUNCIÓN CORREGIDA - Ahora filtra correctamente por USER_ID
async function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = '<div class="loading-message">⏳ Cargando proyectos...</div>';

    // Validar que USER_ID esté configurado
    if (!USER_ID || USER_ID.trim() === '') {
        projectsGrid.innerHTML = `
            <div style="
                text-align: center;
                padding: 3rem 2rem;
                background: white;
                border: 5px solid #FFE66D;
                box-shadow: 5px 5px 0 rgba(0,0,0,0.3);
                margin: 2rem auto;
                max-width: 700px;
                border-radius: 10px;
            ">
                <h3 style="color: #FF6B6B; font-family: 'Bangers', cursive; font-size: 2rem; margin-bottom: 1.5rem;">
                    ⚠️ CONFIGURACIÓN NECESARIA
                </h3>
                <p style="margin-bottom: 1.5rem; line-height: 1.8; font-size: 1.1rem;">
                    Para ver tus proyectos, necesitas configurar tu <strong style="color: #4ECDC4;">USER_ID</strong>:
                </p>
                <ol style="text-align: left; max-width: 500px; margin: 1.5rem auto; line-height: 2; font-size: 1rem;">
                    <li>📂 Abre tu <strong>backoffice</strong> (index.html del backoffice)</li>
                    <li>🔐 <strong>Inicia sesión</strong> con tu cuenta</li>
                    <li>⚡ Verás una <strong>alerta emergente</strong> con tu USER_ID</li>
                    <li>📋 <strong>Copia</strong> ese ID</li>
                    <li>📝 Pégalo en el archivo <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-weight: bold;">portfolio.js</code> (línea 8)</li>
                </ol>
                <div style="background: #f8f8f8; padding: 1rem; border-left: 4px solid #4ECDC4; margin: 2rem auto; max-width: 500px; text-align: left;">
                    <p style="margin: 0; font-family: monospace; font-size: 0.9rem;">
                        const USER_ID = '<span style="color: #FF6B6B;">TU_ID_AQUI</span>';
                    </p>
                </div>
                <p style="margin-top: 2rem; color: #666; font-size: 0.95rem;">
                    💡 <strong>Tip:</strong> El USER_ID es único para cada usuario y se muestra automáticamente al hacer login.
                </p>
            </div>
        `;
        return;
    }

    try {
        
        const url = `${API_URL}/projects/user/${USER_ID}`;
        
        console.log('🔍 Cargando proyectos del usuario:', USER_ID);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('📡 Status de respuesta:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Proyectos recibidos:', data);
            
            projects = Array.isArray(data) ? data : [];
            displayProjects();
            updateProjectCount();
        } else if (response.status === 404) {
            
            console.log('📭 No se encontraron proyectos para este usuario');
            projects = [];
            displayProjects();
            updateProjectCount();
        } else {
            throw new Error(`Error del servidor: ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Error cargando proyectos:', error);
        
        projectsGrid.innerHTML = `
            <div style="
                text-align: center;
                padding: 2rem;
                background: white;
                border: 5px solid #FF6B6B;
                box-shadow: 5px 5px 0 rgba(0,0,0,0.3);
                margin: 2rem auto;
                max-width: 500px;
                border-radius: 10px;
            ">
                <h3 style="color: #FF6B6B; font-family: 'Bangers', cursive; font-size: 1.8rem; margin-bottom: 1rem;">
                    ❌ ERROR DE CONEXIÓN
                </h3>
                <p style="margin-bottom: 1.5rem; line-height: 1.6;">
                    No se pudieron cargar los proyectos. <br>
                    <small style="color: #666; font-size: 0.9rem;">${error.message}</small>
                </p>
                <button 
                    onclick="loadProjects()" 
                    style="
                        background: #4ECDC4;
                        color: white;
                        border: 3px solid black;
                        padding: 0.75rem 1.5rem;
                        font-family: 'Bangers', cursive;
                        font-size: 1.1rem;
                        cursor: pointer;
                        box-shadow: 3px 3px 0 rgba(0,0,0,0.3);
                        transition: all 0.2s;
                        border-radius: 5px;
                    "
                    onmouseover="this.style.transform='translate(-2px, -2px)'; this.style.boxShadow='5px 5px 0 rgba(0,0,0,0.3)'"
                    onmouseout="this.style.transform='translate(0, 0)'; this.style.boxShadow='3px 3px 0 rgba(0,0,0,0.3)'"
                >
                    🔄 REINTENTAR
                </button>
            </div>
        `;
    }
}

function displayProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div style="
                text-align: center;
                padding: 3rem 2rem;
                background: white;
                border: 5px solid #4ECDC4;
                box-shadow: 5px 5px 0 rgba(0,0,0,0.3);
                margin: 2rem auto;
                max-width: 500px;
                border-radius: 10px;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">📭</div>
                <h3 style="font-family: 'Bangers', cursive; font-size: 1.5rem; margin-bottom: 1rem; color: #333;">
                    NO HAY PROYECTOS AÚN
                </h3>
                <p style="color: #666; line-height: 1.6; margin-bottom: 1.5rem;">
                    Los proyectos que crees en el backoffice aparecerán aquí automáticamente.
                </p>
                <p style="color: #4ECDC4; font-weight: bold; font-size: 1.1rem;">
                    🚀 ¡Crea tu primer proyecto!
                </p>
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