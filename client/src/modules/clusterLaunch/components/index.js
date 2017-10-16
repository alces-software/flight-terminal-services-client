/*=============================================================================
 * Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
 *
 * This file is part of Flight Launch.
 *
 * All rights reserved, see LICENSE.txt.
 *===========================================================================*/

// Add publicly exported components here and to the export below.
// Any components which are intended to only be used internally to the
// onboarding module should not be included here.
import { nest } from 'recompose';

import CollectionContext from './CollectionContext';
import FormContainer from './FormContainer';

const Form = nest(CollectionContext, FormContainer);

export { Form };
