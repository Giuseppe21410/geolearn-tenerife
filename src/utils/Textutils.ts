export const ACTIVIDAD_COLORS: Record<string, string> = {
  'Museos y Salas de Arte': '#E53935', 
  'Enseñanza Adultos': '#F4511E', 
  'Enseñanza Profesional': '#F9A825', 
  'Biblioteca y Ludoteca': '#43A047', 
  'Residencia Educativa': '#00ACC1', 
  'Enseñanza Especializada': '#1E88E5', 
  'Enseñanza Idiomas': '#5E35B1', 
  'Guarderías y Centros Infantiles': '#D81B60', 
  'Enseñanza Especial': '#6D4C41', 
  'Enseñanza Universitaria': '#00897B', 
  'Enseñanza a Distancia': '#3949AB', 
  'Enseñanza Obligatoria': '#E67C1B', 
  'Enseñanza Infantil': '#C0CA33', 
  'Enseñanza Secundaria': '#039BE5', 
  'Centro Cultural': '#8E24AA', 
  'Enseñanza Infantil y Primaria': '#00C853', 
  'Asociacion Cultural': '#FF6F00', 
  'Enseñanza Profesorado': '#546E7A', 
  'Default': '#1a73e8'
};

export const formatTitleCase = (str: string): string => {
  const exceptions = ['de', 'del', 'la', 'los', 'las', 'y', 'en', 'a', 'para', 'con'];
  if (!str) return '';
  if (str == "biblioteca ludoteca") return "Biblioteca y Ludoteca";
  if (str == "museos salas de arte") return "Museos y Salas de Arte";
  if (str == "museos salas de arte") return "Museos y Salas de Arte";
  if (str == "guarderias centros infantiles") return "Guarderías y Centros Infantiles";
  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0 || !exceptions.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    })
    .join(' ');
};

export const KNOWN_NORMALIZED_TYPES = new Set([
  'museos salas de arte',
  'centro cultural',
  'asociacion cultural',
  'biblioteca ludoteca',
  'guarderias centros infantiles',
  'enseñanza adultos',
  'enseñanza profesional',
  'enseñanza universitaria',
  'enseñanza idiomas',
  'enseñanza infantil y primaria',
  'enseñanza infantil',
  'enseñanza secundaria',
  'enseñanza obligatoria',
  'enseñanza especial',
  'enseñanza especializada',
  'enseñanza a distancia',
  'enseñanza profesorado',
  'residencia educativa',
]);

export const normalizeActivityQuery = (text: string): string => {
  const t = text.toLowerCase().trim();

  // ─── MUSEOS Y SALAS DE ARTE ───────────────────────────────────────────
  if (
    t.includes('museo') ||
    t.includes('museos') ||
    t.includes('sala de arte') ||
    t.includes('salas de arte') ||
    t.includes('galería') ||
    t.includes('galeria') ||
    t.includes('galerías de arte') ||
    t.includes('colección') ||
    t.includes('coleccion') ||
    t.includes('exposición') ||
    t.includes('exposicion') ||
    t.includes('pinacoteca') ||
    t.includes('arte') && t.includes('sala') ||
    t.includes('museos y salas de arte')
  ) {
    return 'museos salas de arte';
  }

  // ─── CENTRO CULTURAL ──────────────────────────────────────────────────
  if (
    t.includes('centro cultural') ||
    t.includes('centros culturales') ||
    t.includes('centro sociocultural') ||
    t.includes('centro socio cultural') ||
    t.includes('casa de la cultura') ||
    t.includes('casas de la cultura') ||
    t.includes('espacio cultural') ||
    t.includes('espacios culturales') ||
    t.includes('sala cultural') ||
    t.includes('centro cívico') ||
    t.includes('centro civico') ||
    t.includes('ateneo')
  ) {
    return 'centro cultural';
  }

  // ─── ASOCIACIÓN CULTURAL ──────────────────────────────────────────────
  if (
    t.includes('asociacion cultural') ||
    t.includes('asociación cultural') ||
    t.includes('asociaciones culturales') ||
    t.includes('colectivo cultural') ||
    t.includes('colectivos culturales') ||
    t.includes('agrupación cultural') ||
    t.includes('agrupacion cultural') ||
    t.includes('fundación cultural') ||
    t.includes('fundacion cultural') ||
    t.includes('entidad cultural') ||
    t.includes('asociación') && t.includes('cultura')
  ) {
    return 'asociacion cultural';
  }

  // ─── BIBLIOTECA Y LUDOTECA ────────────────────────────────────────────
  if (
    t.includes('biblioteca') ||
    t.includes('bibliotecas') ||
    t.includes('biblioteca pública') ||
    t.includes('biblioteca publica') ||
    t.includes('biblioteca municipal') ||
    t.includes('biblioteca escolar') ||
    t.includes('mediateca') ||
    t.includes('hemeroteca') ||
    t.includes('ludoteca') ||
    t.includes('ludotecas') ||
    t.includes('biblioteca y ludoteca') ||
    t.includes('bibliotecas y ludotecas') ||
    t.includes('sala de lectura') ||
    t.includes('punto de lectura')
  ) {
    return 'biblioteca ludoteca';
  }

  // ─── GUARDERÍAS Y CENTROS INFANTILES ─────────────────────────────────
  if (
    t.includes('guarderia') ||
    t.includes('guardería') ||
    t.includes('guarderías') ||
    t.includes('guarderias') ||
    t.includes('escuela infantil') ||
    t.includes('escuelas infantiles') ||
    t.includes('escuela de educación infantil') ||
    t.includes('centro infantil') ||
    t.includes('centros infantiles') ||
    t.includes('escuela de 0 a 3') ||
    t.includes('0-3') ||
    t.includes('0 a 3') ||
    t.includes('primera infancia') ||
    t.includes('bebe') ||
    t.includes('bebé') ||
    t.includes('bebés') ||
    t.includes('nursery') ||
    t.includes('guarderias y centros infantiles') ||
    t.includes('guarderías y centros infantiles')
  ) {
    return 'guarderias centros infantiles';
  }

  // ─── ENSEÑANZA ADULTOS ────────────────────────────────────────────────
  if (
    t.includes('adultos') ||
    t.includes('adulto') ||
    t.includes('personas adultas') ||
    t.includes('epa') ||
    t.includes('educación de adultos') ||
    t.includes('educacion de adultos') ||
    t.includes('formación para adultos') ||
    t.includes('formacion para adultos') ||
    t.includes('educación permanente') ||
    t.includes('educacion permanente') ||
    t.includes('centro de adultos') ||
    t.includes('centros de adultos') ||
    t.includes('enseñanza de adultos')
  ) {
    return 'enseñanza adultos';
  }

  // ─── FORMACIÓN PROFESIONAL ────────────────────────────────────────────
  if (
    t.includes('formacion profesional') ||
    t.includes('formación profesional') ||
    t.includes('fp') && t.length <= 3 ||
    t === 'fp' ||
    t.includes('ciclo formativo') ||
    t.includes('ciclos formativos') ||
    t.includes('grado medio') ||
    t.includes('grado superior') ||
    t.includes('cfgm') ||
    t.includes('cfgs') ||
    t.includes('técnico superior') ||
    t.includes('tecnico superior') ||
    t.includes('formación dual') ||
    t.includes('formacion dual') ||
    t.includes('fp dual') ||
    t.includes('ciclo de grado')
  ) {
    return 'enseñanza profesional';
  }

  // ─── ENSEÑANZA UNIVERSITARIA ──────────────────────────────────────────
  if (
    t.includes('universidad') ||
    t.includes('universidades') ||
    t.includes('universitaria') ||
    t.includes('universitario') ||
    t.includes('facultad') ||
    t.includes('facultades') ||
    t.includes('campus') ||
    t.includes('escuela superior') ||
    t.includes('escuelas superiores') ||
    t.includes('escuela técnica superior') ||
    t.includes('ets') && t.length <= 4 ||
    t.includes('grado universitario') ||
    t.includes('máster') ||
    t.includes('doctorado') ||
    t.includes('posgrado') ||
    t.includes('postgrado') ||
    t.includes('título universitario') ||
    t.includes('ingeniería') ||
    t.includes('ingenieria') ||
    t.includes('arquitectura') ||
    t.includes('medicina') ||
    t.includes('derecho') && t.includes('facultad')
  ) {
    return 'enseñanza universitaria';
  }

  // ─── ENSEÑANZA DE IDIOMAS ─────────────────────────────────────────────
  if (
    t.includes('idiomas') ||
    t.includes('idioma') ||
    t.includes('escuela oficial de idiomas') ||
    t.includes('eoi') ||
    t.includes('escuela de idiomas') ||
    t.includes('academia de idiomas') ||
    t.includes('language school') ||
    t.includes('inglés') ||
    t.includes('ingles') ||
    t.includes('francés') ||
    t.includes('frances') ||
    t.includes('alemán') ||
    t.includes('aleman') ||
    t.includes('chino') ||
    t.includes('japonés') ||
    t.includes('japones') ||
    t.includes('árabe') ||
    t.includes('arabe') ||
    t.includes('portugués') ||
    t.includes('portugues') ||
    t.includes('italiano') ||
    t.includes('lengua extranjera') ||
    t.includes('lenguas extranjeras') ||
    t.includes('bilingüe') ||
    t.includes('bilingue')
  ) {
    return 'enseñanza idiomas';
  }

  // ─── ENSEÑANZA INFANTIL Y PRIMARIA (antes que infantil genérico) ──────
  if (
    t.includes('infantil y primaria') ||
    t.includes('colegio publico') ||
    t.includes('colegio público') ||
    t.includes('colegio concertado') ||
    t.includes('colegio privado') ||
    t.includes('colegio') ||
    t.includes('ceip') ||
    t.includes('cp ') ||
    t.includes('enseñanza infantil y primaria') ||
    t.includes('enseñanza primaria') ||
    t.includes('educación primaria') ||
    t.includes('educacion primaria') ||
    t.includes('primaria') ||
    t.includes('colegio de primaria') ||
    t.includes('colegio de infantil') ||
    t.includes('cole') ||
    t.includes('escuela primaria') ||
    t.includes('escuelas de primaria') ||
    t.includes('6 años') ||
    t.includes('6 a 12')
  ) {
    return 'enseñanza infantil y primaria';
  }

  // ─── ENSEÑANZA INFANTIL (genérico) ────────────────────────────────────
  if (
    t.includes('educación infantil') ||
    t.includes('educacion infantil') ||
    t.includes('infantil') ||
    t.includes('parvulario') ||
    t.includes('preescolar') ||
    t.includes('pre-escolar') ||
    t.includes('3 a 6') ||
    t.includes('3 años')
  ) {
    return 'enseñanza infantil';
  }

  // ─── ENSEÑANZA SECUNDARIA ─────────────────────────────────────────────
  if (
    t.includes('secundaria') ||
    t.includes('eso') ||
    t.includes('bachillerato') ||
    t.includes('bach') ||
    t.includes('instituto') ||
    t.includes('institutos') ||
    t.includes('bup') ||
    t.includes('cou') ||
    t.includes('educación secundaria') ||
    t.includes('educacion secundaria') ||
    t.includes('12 a 16') ||
    t.includes('12 a 18') ||
    t.includes('selectividad') ||
    t.includes('pbau') ||
    t.includes('evau')
  ) {
    return 'enseñanza secundaria';
  }

  // ─── ENSEÑANZA OBLIGATORIA ────────────────────────────────────────────
  if (
    t.includes('enseñanza obligatoria') ||
    t.includes('educación obligatoria') ||
    t.includes('educacion obligatoria') ||
    t.includes('escolarización obligatoria') ||
    t.includes('escolarizacion obligatoria') ||
    t.includes('etapa obligatoria')
  ) {
    return 'enseñanza obligatoria';
  }

  // ─── ENSEÑANZA ESPECIAL ───────────────────────────────────────────────
  if (
    t.includes('educación especial') ||
    t.includes('educacion especial') ||
    t.includes('enseñanza especial') ||
    t.includes('neae') ||
    t.includes('nee') ||
    t.includes('necesidades educativas especiales') ||
    t.includes('necesidades especiales') ||
    t.includes('diversidad funcional') ||
    t.includes('discapacidad') ||
    t.includes('alumnado con necesidades') ||
    t.includes('centro de educación especial') ||
    t.includes('cee') ||
    t.includes('aula enclave') ||
    t.includes('altas capacidades') ||
    t.includes('autismo') ||
    t.includes('down')
  ) {
    return 'enseñanza especial';
  }

  // ─── ENSEÑANZA ESPECIALIZADA (música, arte, danza…) ──────────────────
  if (
    t.includes('enseñanza especializada') ||
    t.includes('enseñanza musical') ||
    t.includes('enseñanza artística') ||
    t.includes('enseñanza artistica') ||
    t.includes('escuela de arte') ||
    t.includes('escuelas de arte') ||
    t.includes('conservatorio') ||
    t.includes('conservatorios') ||
    t.includes('danza') ||
    t.includes('baile') ||
    t.includes('ballet') ||
    t.includes('música') ||
    t.includes('musica') ||
    t.includes('solfeo') ||
    t.includes('instrumento') ||
    t.includes('teatro') && !t.includes('auditorio') ||
    t.includes('artes escénicas') ||
    t.includes('artes escenicas') ||
    t.includes('artes plásticas') ||
    t.includes('artes plasticas') ||
    t.includes('cepa') ||
    t.includes('escuela de música') ||
    t.includes('escuela de musica') ||
    t.includes('escuela de danza')
  ) {
    return 'enseñanza especializada';
  }

  // ─── ENSEÑANZA A DISTANCIA ────────────────────────────────────────────
  if (
    t.includes('a distancia') ||
    t.includes('online') ||
    t.includes('on line') ||
    t.includes('teleformacion') ||
    t.includes('teleformación') ||
    t.includes('semipresencial') ||
    t.includes('e-learning') ||
    t.includes('elearning') ||
    t.includes('educación virtual') ||
    t.includes('educacion virtual') ||
    t.includes('formación online') ||
    t.includes('formacion online') ||
    t.includes('uned') ||
    t.includes('clase virtual') ||
    t.includes('clases virtuales')
  ) {
    return 'enseñanza a distancia';
  }

  // ─── ENSEÑANZA DEL PROFESORADO ────────────────────────────────────────
  if (
    t.includes('formación del profesorado') ||
    t.includes('formacion del profesorado') ||
    t.includes('profesorado') ||
    t.includes('maestro') ||
    t.includes('maestros') ||
    t.includes('docentes') ||
    t.includes('docente') ||
    t.includes('formación docente') ||
    t.includes('formacion docente') ||
    t.includes('cep') && t.length <= 4 ||
    t.includes('centro de profesores') ||
    t.includes('formación del profesores') ||
    t.includes('capacitación docente') ||
    t.includes('magisterio') ||
    t.includes('formación pedagógica') ||
    t.includes('formacion pedagogica')
  ) {
    return 'enseñanza profesorado';
  }

  // ─── RESIDENCIA EDUCATIVA ─────────────────────────────────────────────
  if (
    t.includes('residencia educativa') ||
    t.includes('residencias educativas') ||
    t.includes('residencia de estudiantes') ||
    t.includes('residencia universitaria') ||
    t.includes('colegio mayor') ||
    t.includes('colegio mayor universitario') ||
    t.includes('residencia escolar') ||
    t.includes('internado') ||
    t.includes('internados') ||
    t.includes('residencia de alumnos') ||
    t.includes('alojamiento universitario') ||
    t.includes('hall universitario')
  ) {
    return 'residencia educativa';
  }

  return text;
};


