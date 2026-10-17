/**
 * Soluciones Digitales - Modern JavaScript
 * Handles Theme Toggling (Dark/Light), Real-Time Schedule Status,
 * Interactive Consultation Modal and Tech Stack Explorer.
 */

(function () {
  'use strict';

  // --- Theme Management ---
  const THEME_KEY = 'soluciones_theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update aria-label and button state
    const toggles = document.querySelectorAll('.theme-toggle');
    toggles.forEach((toggle) => {
      toggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
      toggle.setAttribute('title', theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro');
    });
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // --- Real-time Schedule Status ---
  function updateScheduleStatus() {
    const statusContainer = document.getElementById('live-status-indicator');
    if (!statusContainer) return;

    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const currentHour = now.getHours() + now.getMinutes() / 60;

    let isAvailableNow = false;
    let statusText = '';

    // Mon - Fri (1 - 5): 5:00 PM (17:00) to 9:00 PM (21:00)
    if (day >= 1 && day <= 5) {
      if (currentHour >= 17 && currentHour <= 21) {
        isAvailableNow = true;
        statusText = 'En horario de atención activa (5:00 PM – 9:00 PM)';
      } else if (currentHour < 17) {
        statusText = 'Próxima atención: Hoy a las 5:00 PM';
      } else {
        const nextDayText = day === 5 ? 'Sábado a las 8:00 AM' : 'Mañana a las 5:00 PM';
        statusText = `Próxima atención: ${nextDayText}`;
      }
    } else {
      // Sat - Sun (6, 0): 8:00 AM (8:00) to 12:30 PM (12.5)
      if (currentHour >= 8 && currentHour <= 12.5) {
        isAvailableNow = true;
        statusText = 'En horario de atención activa (8:00 AM – 12:30 PM)';
      } else if (currentHour < 8) {
        statusText = 'Próxima atención: Hoy a las 8:00 AM';
      } else {
        const nextDayText = day === 6 ? 'Domingo a las 8:00 AM' : 'Lunes a las 5:00 PM';
        statusText = `Próxima atención: ${nextDayText}`;
      }
    }

    statusContainer.innerHTML = `
      <span class="live-status-pill">
        <span class="live-dot ${isAvailableNow ? 'active' : ''}"></span>
        <span>${isAvailableNow ? '🟢 ' + statusText : '⏳ ' + statusText}</span>
      </span>
    `;
  }

  // --- Tech Stack Explorer Details ---
  const TECH_DETAILS = {
    'C# / .NET Core': {
      title: 'C# / .NET Core Enterprise',
      desc: 'Desarrollo de APIs RESTful de alto rendimiento, microservicios modulares, Entity Framework Core y seguridad empresarial.',
      deliverables: 'Arquitectura limpia, documentación Swagger interactiva y despliegues optimizados.'
    },
    'Python / Streamlit': {
      title: 'Python & Cuadros de Mando',
      desc: 'Herramientas interactivas para análisis de datos, automatizaciones repetitivas y dashboards rápidos de visualización ejecutiva.',
      deliverables: 'Scripts de automatización y aplicaciones analíticas listas para usar en navegador.'
    },
    'Flutter / Android': {
      title: 'Flutter Multiplataforma',
      desc: 'Aplicaciones nativas para Android e iOS con código unificado, interfaz reactiva a 60 fps y alto rendimiento de UX.',
      deliverables: 'Paquetes APK/AAB compilados, integración de servicios web y soporte offline.'
    },
    'Docker & Cloud': {
      title: 'Docker & Contenedores Cloud',
      desc: 'Estandarización de aplicaciones en contenedores para evitar problemas de compatibilidad y facilitar despliegue en la nube.',
      deliverables: 'Dockerfiles multi-stage, configuraciones Docker Compose y proxies Nginx con SSL.'
    },
    'SQL & Bases de Datos': {
      title: 'SQL & Persistencia Relacional',
      desc: 'Diseño de modelos relacionales en PostgreSQL y SQL Server, normalización, optimización de consultas e índices.',
      deliverables: 'Scripts de migración automatizados, integridad referencial y auditoría de datos.'
    },
    'HTML5 / CSS3 Moderno': {
      title: 'Frontend & UI/UX Accesible',
      desc: 'Construcción de interfaces con altos estándares de accesibilidad (WCAG AA), diseño responsivo y tipografía precisa.',
      deliverables: 'Soporte completo para modo oscuro/claro y rendimiento web optimizado.'
    }
  };

  function initTechStackExplorer() {
    const chips = document.querySelectorAll('.chip');
    const detailBox = document.getElementById('tech-stack-detail');
    if (!chips.length || !detailBox) return;

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');

        const key = chip.getAttribute('data-tech') || chip.innerText.replace(/^[^\w#]+/, '').trim();
        const data = TECH_DETAILS[key];

        if (data) {
          detailBox.innerHTML = `
            <div style="text-align: left; animation: fadeIn 0.3s ease;">
              <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 6px;">${data.title}</h4>
              <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 8px;">${data.desc}</p>
              <div style="font-size: 0.85rem; color: var(--accent-teal-text); font-weight: 600;">
                ✓ Entregables: <span style="font-weight: 400; color: var(--text-main);">${data.deliverables}</span>
              </div>
            </div>
          `;
          detailBox.style.display = 'block';
        }
      });
    });
  }

  // --- Quick Consultation Modal ---
  window.openQuoteModal = function (serviceName) {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;
    const select = document.getElementById('quote-service-select');
    if (select && serviceName) {
      select.value = serviceName;
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeQuoteModal = function () {
    const modal = document.getElementById('quote-modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  function initQuoteForm() {
    const form = document.getElementById('quote-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const service = document.getElementById('quote-service-select').value;
      const clientName = document.getElementById('quote-name').value;
      const details = document.getElementById('quote-details').value;

      const subject = encodeURIComponent(`Consulta de Proyecto: ${service} - ${clientName}`);
      const body = encodeURIComponent(
        `Hola Marcos,\n\nMi nombre es ${clientName}.\nEstoy interesado en el servicio: ${service}.\n\nDetalles del proyecto:\n${details}\n\nQuedo a la espera de coordinar en tu próximo horario de atención disponible.`
      );

      // Open email client with pre-filled message
      window.location.href = `mailto:marcos.sorto@udb.edu.sv?subject=${subject}&body=${body}`;

      setTimeout(() => {
        window.closeQuoteModal();
      }, 500);
    });

    const backdrop = document.getElementById('quote-modal');
    if (backdrop) {
      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) {
          window.closeQuoteModal();
        }
      });
    }
  }

  // --- Document Ready Initialization ---
  document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize Theme
    applyTheme(getPreferredTheme());

    // 2. Attach toggle listener to buttons
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      button.addEventListener('click', toggleTheme);
    });

    // 3. Update real-time schedule
    updateScheduleStatus();
    setInterval(updateScheduleStatus, 60000); // refresh every minute

    // 4. Initialize interactive components
    initTechStackExplorer();
    initQuoteForm();
  });
})();
