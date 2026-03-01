/**
 * Auto-detects projects from src/assets/projects/
 * 
 * How to use:
 * 
 * OPTION 1: Folder per project (recommended for multiple images)
 *   src/assets/projects/
 *     my-project/
 *       cover.jpg (or any image - first alphabetically is used as cover)
 *       my-project.txt (description file)
 *       other-images.png
 * 
 * OPTION 2: Single image per project
 *   src/assets/projects/
 *     my-project.jpg
 *     my-project.txt (optional description)
 * 
 * Description file format:
 *   First line = Category (e.g., "3D Visualization")
 *   Rest = Description text
 */

// Import all project images (flat structure)
const flatImageModules = import.meta.glob(
  '/src/assets/projects_new/*.{jpg,jpeg,png,gif,webp,avif}',
  { eager: true, import: 'default' }
);

// Import all project images from folders (one level deep)
const folderImageModules = import.meta.glob(
  '/src/assets/projects_new/*/*.{jpg,jpeg,png,gif,webp,avif}',
  { eager: true, import: 'default' }
);

// Import all slider images from dedicated slider subfolders
const sliderImageModules = import.meta.glob(
  '/src/assets/projects_new/*/slider/*.{jpg,jpeg,png,gif,webp,avif}',
  { eager: true, import: 'default' }
);

// Import all description files (flat)
const flatTextModules = import.meta.glob(
  '/src/assets/projects_new/*.txt',
  { eager: true, query: '?raw', import: 'default' }
);

// Import all description files (folders)
const folderTextModules = import.meta.glob(
  '/src/assets/projects_new/*/*.txt',
  { eager: true, query: '?raw', import: 'default' }
);

// Import project features (links, sliders, etc.)
let projectFeatures = [];
let projectIds = [];
try {
  projectFeatures = (await import('/src/assets/projects_new/project.features.json')).default;
  projectIds = (await import('/src/assets/projects_new/project.ids.json')).default;
} catch (e) {
  projectFeatures = [];
  projectIds = [];
}

// Color gradients to cycle through
const colorGradients = [
  'from-purple-600/40 to-blue-600/40',
  'from-cyan-600/40 to-teal-600/40',
  'from-orange-600/40 to-red-600/40',
  'from-pink-600/40 to-rose-600/40',
  'from-emerald-600/40 to-green-600/40',
  'from-indigo-600/40 to-violet-600/40',
  'from-amber-600/40 to-yellow-600/40',
  'from-sky-600/40 to-blue-600/40',
];

// Scroll speeds for parallax variety
const scrollSpeeds = [0.8, 1.2, 0.6, 1.0, 0.7, 1.3, 0.9, 1.1];

/**
 * Convert filename to display title
 * "my-cool-project" → "MY COOL PROJECT"
 */
function filenameToTitle(filename) {
  return filename
    .replace(/oe/gi, 'ö')
    .replace(/[-_]/g, ' ')
    .toUpperCase();
}

/**
 * Extract filename without extension from path
 */
function getBasename(path) {
  const filename = path.split('/').pop();
  return filename.replace(/\.[^.]+$/, '');
}

/**
 * Parse description file content
 * First line = category, rest = description
 */
function parseDescriptionFile(content) {
  if (!content) return { category: 'Project', description: '' };
  const lines = content.trim().split('\n');
  const category = lines[0]?.trim() || 'Project';
  const description = lines.slice(1).join('\n').trim();
  return { category, description };
}

/**
 * Extract folder name from path
 */
function getFolderName(path) {
  const parts = path.split('/');
  // Path like /src/assets/projects/folder-name/image.jpg
  return parts[parts.length - 2];
}

/**
 * Load all projects from the assets/projects folder
 * Returns array of project objects ready for ProjectGrid
 */
export function loadProjects() {
    // Helper to apply final column override for specific projects
    function applyFinalColumnOverride(name, col) {
      const key = name.trim().toLowerCase();
      if (
        key === 'naturrausch' ||
        key === 'vhs aalen'
      ) return 0;
      return col;
    }
  const projects = [];
  const processedFolders = new Set();
  let id = 1;

  // Process folder-based projects first
  for (const [imagePath, imageUrl] of Object.entries(folderImageModules)) {
    const folderName = getFolderName(imagePath);
    // Map old folder names to new ones for features
    const folderNameMap = {
      '3d mockups for koestlin gmbh': '3d product visualization',
      'dashboard prototype': 'lead management dashboard',
      'logo for a speech therapy practice': 'mundbild',
      'mouse + mousepad 3d render': 'photorealistic 3d reconstruction',
      'naturrausch redesign': 'naturrausch',
      'poster creation': 'doomscrolling & vertieft',
      'summerfestival poster': 'rampenfestival',
      'vhs aalen redesign': 'vhs aalen',
      'wedding flyer': 'interactive wedding invitation'
    };
    const mappedFolderName = folderNameMap[folderName.trim().toLowerCase()] || folderName;
    // Skip if we already processed this folder
    if (processedFolders.has(folderName)) continue;
    processedFolders.add(folderName);
    // Get all images in this folder (grid/base images)
    let folderImages = Object.entries(folderImageModules)
      .filter(([path]) => getFolderName(path) === folderName)
      .sort(([a], [b]) => a.localeCompare(b));

    // For Photorealistic 3D Reconstruction, use normal PNGs/JPEGs for grid
    // and JPEGs from the slider subfolder for the comparison slider
    let coverImage, allImages, sliderImages = [];
    if (mappedFolderName === 'photorealistic 3d reconstruction') {
      // Grid images: prefer non-transparent if available
      const nonTransparent = folderImages.filter(([path]) => !path.toLowerCase().includes('transparent'));
      const sourceForGrid = nonTransparent.length > 0 ? nonTransparent : folderImages;
      coverImage = sourceForGrid[0][1];
      allImages = sourceForGrid.map(([, url]) => url);

      // Slider images: take all images from the slider subfolder for this project
      sliderImages = Object.entries(sliderImageModules)
        .filter(([path]) => path.includes(`/${folderName}/slider/`))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, url]) => url);
    } else {
      coverImage = folderImages[0][1];
      allImages = folderImages.map(([, url]) => url);
    }
    // Find description file
    const textPath = `/src/assets/projects_new/${folderName}/${folderName}.txt`;
    const textContent = folderTextModules[textPath] || '';
    const { category, description } = parseDescriptionFile(textContent);
    // Get numeric ID from project.ids.json
    const idEntry = projectIds.find(entry => entry.folder === folderName);
    const projectId = idEntry ? idEntry.id : null;
    // Attach features (link, slider, etc.) by numeric ID
    const feature = projectFeatures.find(f => f.id === projectId);
    // Distribute projects across 3 columns
    let column = (id - 1) % 3;
    if (
      mappedFolderName.includes('dashboard') ||
      (category && category.toLowerCase().includes('dashboard')) ||
      mappedFolderName.includes('redesign') ||
      (category && category.toLowerCase().includes('redesign'))
    ) {
      column = 0;
    }
    // Place all 3D-related projects in third column
    if (
      mappedFolderName.toLowerCase().includes('3d') ||
      (category && category.toLowerCase().includes('3d'))
    ) {
      column = 2;
    }
    // Place all print-related projects in second column
    const printFolders = [
      'interactive wedding invitation',
      'doomscrolling & vertieft',
      'print & packaging',
      'rampenfestival',
      'mundbild',
      'vhs aalen',
      'naturrausch',
      'no sense of time'
    ];
    if (printFolders.includes(mappedFolderName.trim().toLowerCase())) {
      column = 1;
    }
    // Apply final override for clarity
    column = applyFinalColumnOverride(mappedFolderName, column);
    // Add link for Naturrausch, Lead Management Dashboard, and VHS Aalen
    let link = undefined;
    if (mappedFolderName === 'naturrausch') {
      link = 'https://naturrausch.vercel.app';
    }
    if (mappedFolderName === 'lead management dashboard') {
      link = 'https://software-prototype-stadtwerke-konst.vercel.app/';
    }
    if (mappedFolderName === 'vhs aalen') {
      link = 'https://vhs-prototyp.vercel.app/';
    }
    projects.push({
      id: projectId,
      title: filenameToTitle(mappedFolderName),
      category,
      description,
      image: coverImage,
      images: allImages,
      sliderImages,
      color:
        mappedFolderName === 'no sense of time'
          ? 'from-yellow-300/70 to-pink-300/70'
          : colorGradients[(id - 1) % colorGradients.length],
      scrollSpeed: scrollSpeeds[(id - 1) % colorGradients.length],
      overlap: 0,
      column,
      debug: `title: ${mappedFolderName}, column: ${column}`,
      ...(feature || {}),
    });
    id++;
  }

  // Process flat image projects
  for (const [imagePath, imageUrl] of Object.entries(flatImageModules)) {
    const basename = getBasename(imagePath);
    const textPath = `/src/assets/projects/${basename}.txt`;
    const textContent = flatTextModules[textPath] || '';
    
    const { category, description } = parseDescriptionFile(textContent);
    
    // Distribute projects across 3 columns
    let column = (id - 1) % 3;
    if (
      basename.toLowerCase().includes('prototype') ||
      (category && category.toLowerCase().includes('prototype')) ||
      basename.toLowerCase().includes('redesign') ||
      (category && category.toLowerCase().includes('redesign'))
    ) {
      column = 0;
    }
    // Place all 3D-related projects in third column
    if (
      basename.toLowerCase().includes('3d') ||
      (category && category.toLowerCase().includes('3d'))
    ) {
      column = 2;
    }
    // Place all print-related projects in second column
    const printFolders = [
      'wedding flyer',
      'poster creation',
      'print & packaging',
      'summerfestival poster',
      'vhs aalen redesign',
      'wedding flyer',
      'naturrausch redesign',
      'no sense of time'
    ];
    if (printFolders.includes(basename.trim().toLowerCase())) {
      column = 1;
    }
    // Apply final override for clarity
    column = applyFinalColumnOverride(basename, column);
    projects.push({
      id,
      title: filenameToTitle(basename),
      category,
      description,
      image: imageUrl,
      images: [imageUrl],
      color: colorGradients[(id - 1) % colorGradients.length],
      scrollSpeed: scrollSpeeds[(id - 1) % scrollSpeeds.length],
      overlap: 0,
      column,
      debug: `title: ${basename}, column: ${column}`,
    });
    
    id++;
  }

  // Sort projects by category (alphabetically), then by title
  projects.sort((a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    // If same category, sort by title
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });
  return projects;
}

/**
 * Get projects organized by columns for masonry layout
 */
export function getProjectColumns(projects) {
  // Group projects by their assigned column property
  const columns = [[], [], []];
  let logoSpeechIdx = -1;
  projects.forEach((project, idx) => {
    if (typeof project.column === 'number' && project.column >= 0 && project.column <= 2) {
      columns[project.column].push(project);
      // Track index if it's logo for a speech therapy practice in column 0
      if (
        project.column === 0 &&
        project.title.trim().toLowerCase() === 'logo for a speech therapy practice'
      ) {
        logoSpeechIdx = columns[0].length - 1;
      }
    } else {
      columns[2].push(project); // Default to column 3 if not set
    }
  });
  // Move logo for a speech therapy practice to end of column 1 if present
  if (logoSpeechIdx > -1) {
    const [logoProject] = columns[0].splice(logoSpeechIdx, 1);
    columns[0].push(logoProject);
  }
  return columns;
}
