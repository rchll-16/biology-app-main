// organelleData.js
import PlasmaMembrane from '../../../assets/images/plasma_membrane.png';
import Nucleus from '../../../assets/images/nucleus.png';
import Cytoplasm from '../../../assets/images/cytoplasm.png';
import EndoplasmicRecticulum from '../../../assets/images/endoplasmic_reticulum.png';
import GolgiBody from '../../../assets/images/golgi_body.png';
import Lysosomes from '../../../assets/images/lysosomes.png';
import Vacuoles from '../../../assets/images/vacuoles.png';
import Mitochondria from '../../../assets/images/mitochondria.png';
import Plastids from '../../../assets/images/plastids.png';
import Centrosome from '../../../assets/images/centrosomes.png';
import Cycoskeleton from '../../../assets/images/cytoskeleton.png';

const organelleData = [
  {
    title: 'Plasma Membrane',
    img: PlasmaMembrane,
    description: ['Thin, flexible, and semi-permeable membrane', 'Made of two layers of lipids with proteins floating', 'Seen only under an electron microscope'],
    functions: ['Maintains cell shape and size', 'Protects cell contents', 'Controls movement of substances in and out', 'Maintains balance (homeostasis)'],
  },
  {
    title: 'Nucleus',
    img: Nucleus,
    description: ['Jelly-like fluid inside the cell', 'Fills the space between the nucleus and the cell membrane', 'Contains organelles, water, salts, and enzymes'],
    functions: ['Controls all cell activities', 'Stores genetic material (DNA)', 'Directs protein synthesis', 'Involved in cell division'],
  },
  {
    title: 'Cytoplasm',
    img: Cytoplasm,
    description: ['Supports and holds organelles in place', 'Site of many chemical reactions', 'Helps in movement of materials within the cell'],
    functions: ['Rough ER: Makes and transports proteins', 'Smooth ER: Makes lipids and detoxifies harmful substances'],
  },
  {
    title: 'Endoplasmic Reticulum',
    img: EndoplasmicRecticulum,
    description: ['Network of membranes in the cytoplasm', 'Two types: Rough ER (with ribosomes) and Smooth ER (without ribosomes)'],
    functions: ['Rough ER: Makes and transports proteins', 'Smooth ER: Makes lipids and detoxifies harmful substances'],
  },
  {
    title: 'Golgi Body',
    img: GolgiBody,
    description: ['Stack of flattened membrane sacs', 'Located near the endoplasmic reticulum'],
    functions: ['Modifies, sorts, and packages proteins and lipids', 'Prepares materials for transport inside or outside the cell', 'Forms vesicles for delivery'],
  },
  {
    title: 'Lysosomes',
    img: Lysosomes,
    description: ['Small, membrane-bound sacs', 'Contain digestive enzymes'],
    functions: ['Break down waste, damaged cell parts, and harmful substances', 'Help defend the cell against bacteria and viruses', 'Aid in cell cleanup and recycling'],
  },
  {
    title: 'Vacuoles',
    img: Vacuoles,
    description: ['Large, membrane-bound sacs', 'Contain water, nutrients, and waste products'],
    functions: ['Store nutrients, water, and waste', 'Maintain proper pressure within the cell for structure and support', 'Help isolate harmful materials', 'In plant cells, vacuoles play a key role in maintaining turgor pressure'],
  },
  {
    title: 'Mitochondria',
    img: Mitochondria,
    description: ['Double-membrane-bound organelles', 'Contain their own DNA and ribosomes'],
    functions: ['Produce energy by converting glucose and oxygen into ATP (cellular respiration)', 'Regulate cellular metabolism', 'Known as the “powerhouses” of the cell'],
  },
  {
    title: 'Plastids',
    img: Plastids,
    description: ['Double-membrane-bound organelles found mainly in plant cells and algae', 'Contain their own DNA'],
    functions: ['Store pigments (e.g., chloroplasts contain chlorophyll for photosynthesis)', 'Synthesize and store important molecules like starch and fatty acids', 'Involved in photosynthesis (chloroplasts), storage (leucoplasts), and pigment synthesis (chromoplasts)'],
  },
  {
    title: 'Centrosome',
    img: Centrosome,
    description: ['A small region near the nucleus in animal cells', 'Contains a pair of centrioles surrounded by a matrix of proteins'],
    functions: ['Organizes microtubules and the cytoskeleton', 'Plays a key role in cell division by forming the spindle fibers that separate chromosomes during mitosis and meiosis', 'Helps maintain cell shape and assists in intracellular transport'],
  },
  {
    title: 'Cytoskeleton',
    img: Cycoskeleton,
    description: ['A network of protein fibers throughout the cytoplasm', 'Made up of microfilaments, intermediate filaments, and microtubules'],
    functions: ['Provides structural support and maintains cell shape', 'Facilitates cell movement (e.g., muscle contraction, crawling)', 'Helps in intracellular transport of organelles and vesicles', 'Involved in cell division by assisting chromosome separation'],
  },
];

export default organelleData;
