"use client";

import OrbCore from "./orbcore";
import Rings from "./rings";
import Particles from "./particles";
import Projector from "./projector";

export default function Hologram() {
	return (
		<div className="relative flex h-full min-h-[720px] items-center justify-center overflow-hidden">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,136,.16),transparent_58%)]" />

			<Projector />
			<Particles />
			<Rings />
			<OrbCore />

			<div className="absolute bottom-9 text-center">
				<h2 className="text-3xl font-black neon">TANNER CORE</h2>
				<p className="mt-2 text-sm text-zinc-500">Neural engine online</p>
			</div>
		</div>
	);
}

