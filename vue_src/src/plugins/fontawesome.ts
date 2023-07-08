/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
// Seach here: https://fontawesome.com/icons
import {
	faEraser, faW, faUserSecret, faArrowsRotate, faLock, faLockOpen,
	faMicrophoneLines, faHeadphones, 
	faStopCircle,
	faLanguage, faMagicWandSparkles,
	faKeyboard, faGear,
	
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(
	faEraser, faW, faUserSecret, faArrowsRotate, faLock, faLockOpen,
	faMicrophoneLines, faHeadphones,
	faStopCircle,
	faLanguage, faMagicWandSparkles,
	faKeyboard, faGear,
)

export default {
	install(app: any) {
		app.component('font-awesome-icon', FontAwesomeIcon)
	}
}