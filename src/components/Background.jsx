const AnimatedBackground = () => {
	return (
		<div className="fixed inset-0">
			<div className="absolute inset-0 bg-[#030014]" />
			<div
				className="absolute inset-0 opacity-20"
				style={{
					background: `
						radial-gradient(600px circle at 0% 0%, rgba(2, 132, 199, 0.3), transparent 60%),
						radial-gradient(600px circle at 100% 0%, rgba(8, 145, 178, 0.25), transparent 60%),
						radial-gradient(600px circle at 20% 100%, rgba(14, 165, 233, 0.2), transparent 60%),
						radial-gradient(600px circle at 80% 100%, rgba(13, 148, 136, 0.15), transparent 60%)
					`,
				}}
			/>
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]" />
		</div>
	)
}

export default AnimatedBackground
