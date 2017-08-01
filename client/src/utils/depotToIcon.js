/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

/* eslint-disable global-require */

export const icons = [
  {
    name: 'clock',
    publisher: 'Freepik',
    depot: 'benchmark',
    depotText: 'Benchmarks',
    icon: require('../icons/flaticon/clock.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/clock_212541',
  },
  {
    name: 'cells-2',
    publisher: 'Freepik',
    depot: 'Biochemistry',
    icon: require('../icons/flaticon/cells-biochemistry.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/cells_212322',
  },
  {
    name: 'dna',
    publisher: 'Freepik',
    depot: 'bioinformatics',
    depotText: 'Bioinformatics',
    icon: require('../icons/flaticon/dna.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/dna_245315',
  },
  {
    name: 'cells',
    publisher: 'Freepik',
    depotText: 'Chemistry',
    depot: 'chemistry',
    icon: require('../icons/flaticon/cells.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/cells_212206',
  },
  {
    name: 'resize-1',
    publisher: 'Freepik',
    depot: 'cfd',
    depotText: 'Fluid Dynamics',
    icon: require('../icons/flaticon/resize-1.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/resize_248360',
  },
  {
    name: 'planet-earth',
    publisher: 'Freepik',
    depot: 'Geography',
    icon: require('../icons/flaticon/planet-earth.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/planet-earth_212105',
  },
  {
    name: 'picture',
    publisher: 'Freepik',
    depot: 'Graphics',
    icon: require('../icons/flaticon/picture.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/picture_240039',
  },
  {
    name: 'eye',
    publisher: 'Freepik',
    depot: 'Imaging',
    icon: require('../icons/flaticon/eye.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/eye_240010',
  },
  {
    name: 'blackboard',
    publisher: 'Freepik',
    depot: 'Languages',
    icon: require('../icons/flaticon/blackboard.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/blackboard_212342',
  },
  {
    name: 'library',
    publisher: 'Freepik',
    depot: 'Libraries',
    icon: require('../icons/flaticon/library.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/library_212532',
  },
  {
    name: 'abacus',
    publisher: 'Freepik',
    depot: 'Mathematics',
    icon: require('../icons/flaticon/abacus.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/abacus_212217',
  },
  {
    name: 'transfer',
    publisher: 'Freepik',
    depot: 'MPI',
    icon: require('../icons/flaticon/transfer.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/transfer_212136',
  },
  {
    name: 'atom',
    publisher: 'Freepik',
    depot: 'Physics',
    icon: require('../icons/flaticon/atom.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/atom_212266',
  },
  {
    name: 'ruler',
    publisher: 'Freepik',
    depot: 'Tools',
    icon: require('../icons/flaticon/ruler.svg'),
    licenses: 'Flaticon Basic License',
    originalUrl: 'http://www.flaticon.com/free-icon/ruler_212562',
  },
];

const depotToIconMap = icons.reduce(
  // eslint-disable-next-line no-param-reassign
  (accum, i) => { accum[i.depot] = i; return accum; },
  {},
);

const depotToIcon = depot => depotToIconMap[depot];

export default depotToIcon;
