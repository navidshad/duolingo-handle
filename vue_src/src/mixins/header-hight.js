export default {
	computed: {
		headerHeight() {
			let headerHeight = this.$refs.header.$el.clientHeight;
			return headerHeight;
		},

		windowType() {
			return this.$route.path.replaceAll("/", "");
		},
	},

	mounted() {
		this.setBound()
	},

	methods: {
		async setBound() {
			const {
				height,
				y,
			} = await window.electronAPI.getBound();

			window.electronAPI.setBound(this.windowType, {
				y: Math.abs(y - (this.headerHeight + 40)),
				height: height + this.headerHeight
			})
		}
	}
}