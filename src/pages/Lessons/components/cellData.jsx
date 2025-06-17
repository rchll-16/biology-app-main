// cellData.js
import Sperm from '../../../assets/images/sperm.png';
import RedBloodCell from '../../../assets/images/red_blood.png';
import RootHairCell from '../../../assets/images/root_hair.png';
import NerveCell from '../../../assets/images/nerve.png';
import Cilia from '../../../assets/images/cilia.png';
import Microvilli from '../../../assets/images/microvilli.png';

const cellData = [
  {
    name: 'Sperm Cells',
    image: Sperm,
    description: 'Sperm cells are the male reproductive cells designed for movement and delivering genetic material to the female egg. They have a compact head containing DNA and a long, whip-like tail (flagellum) that propels them forward in search of an egg to fertilize.',
    fact: 'A single ejaculation can contain between 40 million and 1.2 billion sperm cells!',
  },
  {
    name: 'Root Hair Cell',
    image: RootHairCell,
    description: 'Root hairs are thin extensions of plant root epidermal cells that significantly increase the surface area for absorbing water and nutrients from the soil. These structures play a vital role in plant health by maximizing contact with the soil environment.',
    fact: 'A single plant can have billions of root hairs, greatly increasing its ability to absorb water.',
  },
  {
    name: 'Red Blood Cell',
    image: RedBloodCell,
    description: 'Red blood cells are uniquely adapted to transport oxygen throughout the body. They are shaped like flexible, biconcave discs, lack a nucleus to maximize space, and are filled with hemoglobin, a protein that binds and carries oxygen efficiently through the bloodstream.',
    fact: 'The human body contains about 20-30 trillion red blood cells!',
  },
  {
    name: 'Microvilli',
    image: Microvilli,
    description: 'Microvilli are tiny, finger-like projections found on the surface of some cells, especially those lining the intestines. Their main function is to increase the surface area of the cell, allowing for more efficient absorption of nutrients and other substances from the environment.',
    fact: 'If you stretched out all the microvilli in your small intestine, they would cover a tennis court!',
  },
  {
    name: 'Nerve Cells (Neurons)',
    image: NerveCell,
    description: 'Nerve cells, or neurons, are specialized for communication within the body. They have long extensions called axons and dendrites that transmit electrical signals between the brain, spinal cord, and the rest of the body, enabling rapid responses and coordination.',
    fact: 'The human brain has approximately 86 billion neurons.',
  },
  {
    name: 'Cilia',
    image: Cilia,
    description: 'Cilia are short, hair-like structures that extend from the surface of certain cells. They beat in coordinated waves to move substances across the cell surface, such as clearing mucus and dust from the respiratory tract or helping single-celled organisms move through liquid.',
    fact: 'Cilia in your respiratory tract beat about 10-20 times per second to clear out debris.',
  },
];

export default cellData;
