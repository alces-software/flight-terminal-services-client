/*=============================================================================
 * Copyright (C) 2016 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

export function processClusterSpecs(clusterSpecs) {
  const sharedIcons = clusterSpecs.sharedIcons;

  return clusterSpecs.clusterSpecs.map(clusterSpec => {
    let icons = ( clusterSpec.ui.icons || [] ).map(icon => {
      if (icon.sharedIcon) {
        return sharedIcons[icon.sharedIcon];
      }
      return icon;
    });

    return {
      ...clusterSpec,
      ui: {
        ...clusterSpec.ui,
        icons: icons,
      },
      features: clusterSpec.features || {},
      availability: clusterSpec.availability || "any",
    };
  });
}
