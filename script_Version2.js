// Malla Medicina Veterinaria UC
const malla = [
  {
    semestre: "Semestre 1",
    ramos: [
      "Introducción a la Medicina Veterinaria",
      "Química",
      "Física para Ciencias Biomédica",
      "Cálculo",
      "Biología y Diversidad Animal",
      "Filosofía: ¿Para Qué?"
    ]
  },
  {
    semestre: "Semestre 2",
    ramos: [
      "Anatomía Veterinaria I",
      "Biología Molecular de la Célula",
      "Histología y Embriología",
      "Bioestadística",
      "Ética Veterinaria",
      { nombre: "Electivo Formación General", tipo: "electivo" }
    ]
  },
  {
    semestre: "Semestre 3",
    ramos: [
      "Anatomía Veterinaria II",
      "Fisiología Animal",
      "Ecología Veterinaria",
      "Etología y Bienestar Animal",
      { nombre: "Electivo Formación General", tipo: "electivo" }
    ]
  },
  {
    semestre: "Semestre 4",
    ramos: [
      "Microbiología e Inmunología",
      "Fisiopatología Veterinaria",
      "Genética y Evolución",
      "Procedimientos del Manejo Animal",
      { nombre: "Electivo Formación General", tipo: "electivo" },
      { nombre: "Electivo Formación General", tipo: "electivo" }
    ]
  },
  {
    semestre: "Semestre 5",
    ramos: [
      "Enfermedades Parasitarias",
      "Patología General y Sistemática",
      "Nutrición y Metabolismo Animal",
      "Alimentos y Alimentación Animal",
      { nombre: "Electivo Formación General", tipo: "electivo" }
    ]
  },
  {
    semestre: "Semestre 6",
    ramos: [
      "Enfermedades Infecciosas",
      "Farmacología y Toxicología",
      "Reproducción Animal",
      { nombre: "Electivo Formación General", tipo: "electivo" },
      { nombre: "Electivo Formación General", tipo: "electivo" }
    ]
  },
  {
    semestre: "Semestre 7",
    ramos: [
      "Semiología y Métodos Diagnósticos",
      "Patología Clínica",
      "Ginecología y Obstetricia",
      "Salud Pública y Epidemiología",
      "Producción de Monogástricos"
    ]
  },
  {
    semestre: "Semestre 8",
    ramos: [
      "Medicina Interna I",
      "Calidad e Inocuidad de Productos Pecuarios",
      "Producción de Rumiantes",
      "Economía y Administración Veterinaria",
      "Manejo de Vida Silvestre y Medicina de Animales Exóticos"
    ]
  },
  {
    semestre: "Semestre 9",
    ramos: [
      "Medicina Interna II",
      "Cirugía y Anestesia",
      "Formulación y Evaluación de Proyectos en Medicina Veterinaria",
      { nombre: "Optativo de Profundización", tipo: "optativo" },
      { nombre: "Optativo de Profundización", tipo: "optativo" }
    ]
  },
  {
    semestre: "Semestre 10",
    ramos: [
      "Imagenología Veterinaria",
      "Cirugía y Anestesia Avanzada",
      { nombre: "Optativo de Profundización", tipo: "optativo" },
      { nombre: "Optativo de Profundización", tipo: "optativo" },
      { nombre: "Optativo de Profundización", tipo: "optativo" }
    ]
  },
  {
    semestre: "Semestre 11 – 12",
    ramos: [
      { nombre: "Internado en Caninos y Felinos: Cirugía y Anestesia", tipo: "internado" },
      { nombre: "Internado en Caninos y Felinos: Emergencia y Cuidados Intensivos", tipo: "internado" },
      { nombre: "Internado en Caninos y Felinos: Imagenología", tipo: "internado" },
      { nombre: "Internado en Caninos y Felinos: Reproducción", tipo: "internado" },
      { nombre: "Internado en Caninos y Felinos: Medicina Interna", tipo: "internado" },
      { nombre: "Internado en Caninos y Felinos: Patología Animal", tipo: "internado" },
      { nombre: "Internado en Caninos y Felinos: Patología Clínica", tipo: "internado" },
      { nombre: "Internado Electivo", tipo: "internado-electivo" }
    ]
  }
];

// Para localStorage, guardar estado de aprobados y nombres editados
const ESTADO_KEY = "malla_estado";
let estado = JSON.parse(localStorage.getItem(ESTADO_KEY) || "{}");

// Colores únicos por ramo
function getColorClass(idx) {
  return `color${idx % 46}`; // hay 46 colores en estilos.css
}

// Modal para optativos/electivos/internado-electivo
const modal = document.getElementById('modal');
const modalInput = document.getElementById('modal-input');
const modalConfirm = document.getElementById('modal-confirm');
const closeModalBtn = document.getElementById('close-modal');
let modalRamoId = null;

function openModal(ramoId) {
  modal.style.display = "flex";
  modalInput.value = "";
  modalRamoId = ramoId;
  modalInput.focus();
}
function closeModal() {
  modal.style.display = "none";
  modalRamoId = null;
}
closeModalBtn.onclick = closeModal;

// Confirmar nombre de optativo/electivo/internado-electivo
modalConfirm.onclick = () => {
  const nombre = modalInput.value.trim();
  if (!nombre) {
    modalInput.style.borderColor = "#e74c3c";
    modalInput.focus();
    return;
  }
  marcarAprobado(modalRamoId, nombre);
  closeModal();
};

// Render Malla
const mallaDiv = document.getElementById("malla");

function renderMalla() {
  mallaDiv.innerHTML = "";
  let ramoIdx = 0;
  malla.forEach((sem, sIdx) => {
    const semDiv = document.createElement("div");
    semDiv.className = "semestre";
    const semTitulo = document.createElement("div");
    semTitulo.className = "semestre-titulo";
    semTitulo.textContent = sem.semestre;
    semDiv.appendChild(semTitulo);

    const grid = document.createElement("div");
    grid.className = "ramos-grid";

    sem.ramos.forEach((ramo, rIdx) => {
      let nombre = typeof ramo === "string" ? ramo : ramo.nombre;
      let tipo = typeof ramo === "string" ? null : ramo.tipo;
      let uniqueId = `ramo_${sIdx}_${rIdx}`;

      // Estado
      let aprobado = estado[uniqueId]?.aprobado;
      let nombreEditado = estado[uniqueId]?.nombreEditado;

      const ramoDiv = document.createElement("div");
      ramoDiv.className = `ramo ${getColorClass(ramoIdx)}${aprobado ? " tachado" : ""}`;
      if (tipo === "optativo") ramoDiv.classList.add("optativo");
      if (tipo === "electivo") ramoDiv.classList.add("electivo");
      if (tipo === "internado-electivo") ramoDiv.classList.add("internado-electivo");

      ramoDiv.textContent = nombreEditado || nombre;
      if (nombreEditado) ramoDiv.classList.add("nombre-editado");

      ramoDiv.onclick = () => {
        if (aprobado) return; // Ya tachado
        if (tipo === "optativo" || tipo === "electivo" || tipo === "internado-electivo") {
          openModal(uniqueId);
        } else {
          marcarAprobado(uniqueId);
        }
      };

      grid.appendChild(ramoDiv);
      ramoIdx++;
    });

    semDiv.appendChild(grid);
    mallaDiv.appendChild(semDiv);
  });
}

function marcarAprobado(ramoId, nombreEditado) {
  if (!estado[ramoId]) estado[ramoId] = {};
  estado[ramoId].aprobado = true;
  if (nombreEditado) estado[ramoId].nombreEditado = nombreEditado;
  localStorage.setItem(ESTADO_KEY, JSON.stringify(estado));
  renderMalla();
}

// Permite cerrar modal con ESC o clic fuera
window.onclick = (e) => {
  if (e.target === modal) closeModal();
};
window.onkeydown = (e) => {
  if (e.key === "Escape" && modal.style.display === "flex") closeModal();
};

renderMalla();