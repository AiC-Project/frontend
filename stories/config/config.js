import {configure} from '@kadira/storybook';

import 'build/css/materialdesignicons.min.css';
import 'build/fonts/materialdesignicons-webfont.woff2';
import 'build/fonts/materialdesignicons-webfont.woff';
import 'build/fonts/materialdesignicons-webfont.ttf';
import 'build/css/main.css';
import '../story.css';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const req = require.context('../components/', true, /^\.\/.*\.jsx?$/);

function loadStories() {
	req.keys().forEach(req);
}

configure(loadStories, module);
