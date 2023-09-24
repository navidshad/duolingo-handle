/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import all icons and add to library
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)

export default {
	install(app: any) {
		app.component('font-awesome-icon', FontAwesomeIcon)
	}
}