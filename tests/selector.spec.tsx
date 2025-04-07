import { Button } from "@/components/ui/button";
import { expect, test } from "@playwright/experimental-ct-react";

test.describe("selector", () => {
	test("default", async ({ mount }) => {
		const selector = await mount(
			<Button className="w-[73px]" size="M" variant="selector">
				Label
			</Button>,
		);
		const screenShot = await selector.screenshot();
		expect(screenShot).toMatchSnapshot("default.png", {
			maxDiffPixels: 89,
		});
	});
	test("hover", async ({ mount }) => {
		const selector = await mount(
			<Button className="w-[73px]" size="M" variant="selector">
				Label
			</Button>,
		);
		await selector.hover();
		const screenShot = await selector.screenshot({
			animations: "disabled",
			omitBackground: true,
		});
		expect(screenShot).toMatchSnapshot("hover.png", {
			maxDiffPixels: 89,
		});
	});
	test("active", async ({ mount }) => {
		const selector = await mount(
			<Button
				className="w-[73px]"
				data-active={true}
				size="M"
				variant="selector"
			>
				Label
			</Button>,
		);
		const screenShot = await selector.screenshot();
		expect(screenShot).toMatchSnapshot("active.png", {
			maxDiffPixels: 89,
		});
	});
	test("disabled", async ({ mount }) => {
		const selector = await mount(
			<Button className="w-[73px]" disabled={true} size="M" variant="selector">
				Label
			</Button>,
		);
		const screenShot = await selector.screenshot();
		expect(screenShot).toMatchSnapshot("disabled.png", {
			maxDiffPixels: 89,
		});
	});
	test.describe("group", () => {
		test("2", async ({ mount }) => {
			const group = await mount(
				<div className="flex max-w-min flex-row gap-1">
					<Button
						className="w-[73px]"
						data-active={true}
						size="M"
						variant="selector"
					>
						Label
					</Button>
					<Button className="w-[73px]" size="M" variant="selector">
						Label
					</Button>
				</div>,
			);
			const screenShot = await group.screenshot();
			expect(screenShot).toMatchSnapshot(["group", "1.png"], {
				maxDiffPixels: 174,
			});
		});
		test("3", async ({ mount }) => {
			const group = await mount(
				<div className="flex max-w-min flex-row gap-1">
					<Button
						className="min-w-[65px]"
						data-active={true}
						size="M"
						variant="selector"
					>
						Label
					</Button>
					<Button className="min-w-[65px]" size="M" variant="selector">
						Label
					</Button>
					<Button className="min-w-[65px]" size="M" variant="selector">
						Label
					</Button>
				</div>,
			);
			const screenShot = await group.screenshot();
			expect(screenShot).toMatchSnapshot(["group", "2.png"], {
				maxDiffPixels: 259,
			});
		});
		test("4", async ({ mount }) => {
			const group = await mount(
				<div className="flex max-w-min flex-row gap-1">
					<Button
						className="w-[65.75px]"
						data-active={true}
						size="M"
						variant="selector"
					>
						Label
					</Button>
					<Button className="w-[65.75px]" size="M" variant="selector">
						Label
					</Button>
					<Button className="w-[65.75px]" size="M" variant="selector">
						Label
					</Button>
					<Button className="w-[65.75px]" size="M" variant="selector">
						Label
					</Button>
				</div>,
			);
			const screenShot = await group.screenshot();
			expect(screenShot).toMatchSnapshot(["group", "3.png"], {
				maxDiffPixels: 339,
			});
		});
		test("7", async ({ mount }) => {
			const group = await mount(
				<div className="flex w-fit flex-row gap-1">
					<Button
						className="w-[59.43px]"
						data-active={true}
						size="M"
						variant="selector"
					>
						Label
					</Button>
					<Button className="w-[59.43px]" size="M" variant="selector">
						Label
					</Button>
					<Button className="w-[59.43px]" size="M" variant="selector">
						Label
					</Button>
					<Button className="w-[59.43px]" size="M" variant="selector">
						Label
					</Button>
					<Button className="w-[59.43px]" size="M" variant="selector">
						Label
					</Button>
					<Button className="w-[59.43px]" size="M" variant="selector">
						Label
					</Button>
					<Button className="w-[59.43px]" size="M" variant="selector">
						Label
					</Button>
				</div>,
			);
			const screenShot = await group.screenshot();
			expect(screenShot).toMatchSnapshot(["group", "4.png"], {
				maxDiffPixels: 597,
			});
		});
	});
});
