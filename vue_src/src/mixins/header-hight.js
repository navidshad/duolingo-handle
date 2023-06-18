export default {
	data() {
		return {
			contentHeight: 0,
		}
	},

	computed: {
		headerHeight() {
			return this.$refs.header.$el.clientHeight;
		},

		windowType() {
			return this.$route.path.replaceAll("/", "");
		},
	},

	mounted() {
		this.setBound()
		window.addEventListener('resize', this.setContentHeight);
	},

	methods: {
		async setContentHeight() {
			const {
				height = 0
			} = await window.electronAPI.getBound();

			this.contentHeight = height - this.headerHeight
		},

		async setBound() {
			const {
				height,
				y,
			} = await window.electronAPI.getBound();

			window.electronAPI.setBound(this.windowType, {
				y: Math.abs(y - (this.headerHeight + 0)),
				height: height + this.headerHeight
			})
		}
	}
}