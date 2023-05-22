/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
	faEraser, faW, faUserSecret, faArrowsRotate, faLock, faLockOpen,
	faMicrophoneLines, faStopCircle,
	faLanguage, faMagicWandSparkles,
	faKeyboard,
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(
	faEraser, faW, faUserSecret, faArrowsRotate, faLock, faLockOpen,
	faMicrophoneLines, faStopCircle,
	faLanguage, faMagicWandSparkles,
	faKeyboard,
)

export default {
	install(app: any) {
		app.component('font-awesome-icon', FontAwesomeIcon)
	}
}