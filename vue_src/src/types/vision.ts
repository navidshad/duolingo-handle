export interface TextAnnotations {
	locale: string
	description: string
	boundingPoly: BoundingPoly
}

export interface BoundingPoly {
	vertices: Vertex[]
}

export interface Vertex {
	x: number
	y: number
}
