// ==UserScript==
// @name         Filtro de ofertas Tecnoempleo + Botonera
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Filtra ofertas de empleo en Tecnoempleo con controles interactivos y paginación arriba
// @author       Tú
// @match        https://www.tecnoempleo.com/ofertas-trabajo/*
// ==/UserScript==

(function () {
    'use strict';

    // === CONFIGURACIÓN ===
    const salarioMinimo = 35000; // Salario mínimo deseado (en euros)
    const empresasExcluidas = ['', 'Otra Empresa']; // Empresas a excluir
    const tecnologiasExcluidas = ['java', 'spring', 'angular', 'vue', 'php', 'laravel', 'COBOl', 'flutter', 'Android', 'iOS', 'Kotlin', 'React', 'iOS']; // Tecnologías que NO quieres ver
    const tecnologiasWhitelist = ['.Net', 'C#', 'SQL','GIS','ArcGIS','gis','leaflet','Leaflet','qgis','QGIS','Python','QGIS','QGIS','QGIS','QGIS']; // Tecnologías que permiten mostrar la oferta aunque esté en tecnologíasExcluidas

    // === ESTADO DE FILTROS ===
    let filtrosActivos = {
        salarioSin: true,  // Ocultar ofertas sin salario
        salarioBajo: true, // Ocultar ofertas con salario por debajo del salario mínimo
        empresas: true,    // Ocultar empresas en lista negra
        inscrito: true,    // Ocultar ofertas ya inscrito
        tecnologias: true  // Ocultar ofertas con tecnologías excluidas
    };

    // === FUNCIONES ===
    function parseSalario(texto) {
        const match = texto.match(/(\d{1,3}(?:\.\d{3})?)\s*€\s*-\s*(\d{1,3}(?:\.\d{3})?)/);
        if (match) return parseInt(match[2].replace(/\./g, ''));
        return null;
    }

    function contieneTecnologia(excluidas, whitelist, contenedor) {
        const badges = contenedor.querySelectorAll('span.badge');
        let hasWhitelistTech = false;

        for (const badge of badges) {
            const texto = badge.textContent.trim().toLowerCase();
            if (whitelist.includes(texto)) {
                hasWhitelistTech = true;
                break;
            }
        }

        if (hasWhitelistTech) return false; // No aplicar filtro si hay tecnología de la whitelist

        // Si no está en la whitelist, aplicar el filtro de tecnologías excluidas
        for (const badge of badges) {
            const texto = badge.textContent.trim().toLowerCase();
            if (excluidas.includes(texto)) {
                return true;
            }
        }
        return false;
    }

    function aplicarFiltros() {
        const contenedoresOferta = document.querySelectorAll('div.p-3.border.rounded.mb-3.bg-white');
        let ofertasOcultas = 0;

        contenedoresOferta.forEach(contenedor => {
            const oferta = contenedor.querySelector('.row.fs--15');
            if (!oferta) return;

            let ocultar = false;
            const textoOferta = oferta.innerText.toLowerCase();

            // Filtro de salario sin salario
            if (filtrosActivos.salarioSin) {
                if (!textoOferta.includes('€')) ocultar = true; // Si no tiene salario definido
            }

            // Filtro de salario por debajo del salario mínimo
            if (filtrosActivos.salarioBajo) {
                const salarioTexto = textoOferta.match(/(\d{1,3}(?:\.\d{3})?)\s*€\s*-\s*(\d{1,3}(?:\.\d{3})?)\s*€/);
                if (salarioTexto) {
                    const salarioMax = parseInt(salarioTexto[2].replace(/\./g, ''));
                    if (salarioMax < salarioMinimo) ocultar = true;
                }
            }

            // Filtro de empresas
            if (filtrosActivos.empresas) {
                const empresa = oferta.querySelector('a[href*="/re-"], a[href*="trabajo"]');
                if (empresa && empresasExcluidas.some(e => empresa.textContent.trim().toLowerCase() === e.toLowerCase())) {
                    ocultar = true;
                }
            }

            // Filtro de tecnologías
            if (filtrosActivos.tecnologias && contieneTecnologia(tecnologiasExcluidas, tecnologiasWhitelist, oferta)) {
                ocultar = true;
            }

            // Filtro de ya inscrito
            if (filtrosActivos.inscrito && textoOferta.includes('ya estás inscrito')) {
                ocultar = true;
            }

            // Ocultar o mostrar el contenedor completo
            if (ocultar) {
                contenedor.style.display = 'none';
                ofertasOcultas++;
            } else {
                contenedor.style.display = '';
            }
        });

        // Actualizar el contador de ofertas ocultas
        document.getElementById('contador-ofertas-ocultas').textContent = `${ofertasOcultas}/30 ofertas ocultas`;
    }

    function crearBotonera() {
        const h1 = document.querySelector('h1.h4');
        if (!h1) return;

        // Crear contenedor
        const contenedor = document.createElement('div');
        contenedor.style.display = 'flex';
        contenedor.style.flexWrap = 'wrap';
        contenedor.style.gap = '10px';
        contenedor.style.alignItems = 'center';
        contenedor.style.justifyContent = 'center';
        contenedor.style.margin = '10px 0';

        // Función para crear un botón
        const crearBoton = (label, filtroKey, colorActivo, colorInactivo) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.style.padding = '6px 12px';
            btn.style.border = '1px solid #ccc';
            btn.style.borderRadius = '5px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '14px';
            btn.style.backgroundColor = filtrosActivos[filtroKey] ? colorActivo : colorInactivo;

            btn.onclick = () => {
                filtrosActivos[filtroKey] = !filtrosActivos[filtroKey];
                btn.style.backgroundColor = filtrosActivos[filtroKey] ? colorActivo : colorInactivo;
                aplicarFiltros();
            };

            return btn;
        };

        // Crear botones
        contenedor.appendChild(crearBoton('Ocultar ofertas sin salario', 'salarioSin', '#f8d7da', '#f1f1f1'));
        contenedor.appendChild(crearBoton(`Ocultar ofertas con salario por debajo de ${formatSalario(salarioMinimo)}`, 'salarioBajo', '#d4edda', '#f1f1f1'));
        contenedor.appendChild(crearBoton('Ocultar empresas en lista negra', 'empresas', '#fff3cd', '#f1f1f1'));
        contenedor.appendChild(crearBoton('Ocultar ofertas ya inscrito', 'inscrito', '#cce5ff', '#f1f1f1'));
        contenedor.appendChild(crearBoton('Ocultar ofertas de tecnologías excluidas', 'tecnologias', '#d1ecf1', '#f1f1f1'));

        // Crear y mostrar contador de ofertas ocultas
        const contadorOfertas = document.createElement('span');
        contadorOfertas.id = 'contador-ofertas-ocultas';
        contadorOfertas.textContent = '0 ofertas ocultas';
        contadorOfertas.style.marginLeft = '15px';
        contadorOfertas.style.fontWeight = 'bold';
        contenedor.appendChild(contadorOfertas);

        // Copiar paginación
        const paginacionOriginal = document.querySelector('nav[aria-label="pagination"]');
        if (paginacionOriginal) {
            const paginacionClon = paginacionOriginal.cloneNode(true);
            contenedor.appendChild(paginacionClon);
        }

        // Insertar la botonera justo debajo del <h1>
        h1.insertAdjacentElement('afterend', contenedor);
    }

    // Función para formatear salario (e.g., "35000" -> "35K")
    function formatSalario(salario) {
        if (salario >= 1000) {
            return (salario / 1000) + 'K';
        }
        return salario + '€';
    }

    // === INICIO ===
    const observer = new MutationObserver(() => {
        // Asegurarse de que la página cargue nuevas ofertas dinámicamente
        setTimeout(aplicarFiltros, 1000); // Retraso para garantizar que los nuevos elementos se carguen
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        crearBotonera();
        aplicarFiltros();
    });

})();
