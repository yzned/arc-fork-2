import { Button } from "@/components/ui/button";
import { expect, test } from "@playwright/experimental-ct-react";
import PlugSrc from "../src/icons/plug.svg";

test.describe("button", () => {
	test.describe("primary", () => {
		test("default", async ({ mount }) => {
			const button = await mount(
				<Button className="h-[40px] w-[304px]" variant="primary">
					Label
				</Button>,
			);
			const screenShot = await button.screenshot();
			expect(screenShot).toMatchSnapshot(["primary", "default.png"], {
				maxDiffPixels: 93,
			});
		});
		test("hover", async ({ mount }) => {
			const button = await mount(
				<Button className="h-[40px] w-[304px]" variant="primary">
					Label
				</Button>,
			);
			await button.hover();
			const screenShot = await button.screenshot({ animations: "disabled" });
			expect(screenShot).toMatchSnapshot(["primary", "hover.png"], {
				maxDiffPixels: 93,
			});
		});
		test("disabled", async ({ mount }) => {
			const button = await mount(
				<Button
					className="h-[40px] w-[304px]"
					disabled={true}
					variant="primary"
				>
					Label
				</Button>,
			);

			const screenShot = await button.screenshot();
			expect(screenShot).toMatchSnapshot(["primary", "disabled.png"], {
				maxDiffPixels: 87,
			});
		});
		test.describe("icon", () => {
			test("icon default", async ({ mount }) => {
				const button = await mount(
					<Button size="L" variant="primary" className="px-3">
						<PlugSrc />
					</Button>,
				);
				const screenShot = await button.screenshot();
				expect(screenShot).toMatchSnapshot(["primary", "icon", "default.png"], {
					maxDiffPixels: 4,
				});
			});
			test("icon hover", async ({ mount }) => {
				const button = await mount(
					<Button size="L" variant="primary" className="px-3">
						<PlugSrc />
					</Button>,
				);
				await button.hover();
				const screenShot = await button.screenshot({ animations: "disabled" });
				expect(screenShot).toMatchSnapshot(["primary", "icon", "hover.png"], {
					maxDiffPixels: 4,
				});
			});
			test("icon disabled", async ({ mount }) => {
				const button = await mount(
					<Button size="L" disabled={true} variant="primary" className="px-3">
						<PlugSrc />
					</Button>,
				);
				const screenShot = await button.screenshot();
				expect(screenShot).toMatchSnapshot(
					["primary", "icon", "disabled.png"],
					{
						maxDiffPixels: 4,
					},
				);
			});
		});
	});
	test.describe("secondary", () => {
		test("default", async ({ mount }) => {
			const button = await mount(
				<Button className="h-[40px] w-[304px]" variant="secondary">
					Label
				</Button>,
			);
			const screenShot = await button.screenshot();
			expect(screenShot).toMatchSnapshot(["secondary", "default.png"], {
				maxDiffPixels: 88,
			});
		});
		test("hover", async ({ mount }) => {
			const button = await mount(
				<Button className="h-[40px] w-[304px]" variant="secondary">
					Label
				</Button>,
			);
			await button.hover();
			const screenShot = await button.screenshot({ animations: "disabled" });
			expect(screenShot).toMatchSnapshot(["secondary", "hover.png"], {
				maxDiffPixels: 88,
			});
		});
		test("disabled", async ({ mount }) => {
			const button = await mount(
				<Button
					className="h-[40px] w-[304px]"
					disabled={true}
					variant="secondary"
				>
					Label
				</Button>,
			);
			const screenShot = await button.screenshot();
			expect(screenShot).toMatchSnapshot(["secondary", "disabled.png"], {
				maxDiffPixels: 87,
			});
		});
	});
	test.describe("tertiary", () => {
		test("default", async ({ mount }) => {
			const button = await mount(
				<Button className="h-[40px] w-[304px]" variant="tertiary">
					Label
				</Button>,
			);
			const screenShot = await button.screenshot();
			expect(screenShot).toMatchSnapshot(["tertiary", "default.png"], {
				maxDiffPixels: 89,
			});
		});
		test("hover", async ({ mount }) => {
			const button = await mount(
				<Button className="h-[40px] w-[304px]" variant="tertiary">
					Label
				</Button>,
			);
			await button.hover();
			const screenShot = await button.screenshot({ animations: "disabled" });
			expect(screenShot).toMatchSnapshot(["tertiary", "hover.png"], {
				maxDiffPixels: 88,
			});
		});
		test("disabled", async ({ mount }) => {
			const button = await mount(
				<Button
					className="h-[40px] w-[304px]"
					disabled={true}
					variant="tertiary"
				>
					Label
				</Button>,
			);
			const screenShot = await button.screenshot();
			expect(screenShot).toMatchSnapshot(["tertiary", "disabled.png"], {
				maxDiffPixels: 87,
			});
		});
	});
	test.describe("tab", () => {
		test("default", async ({ mount }) => {
			const button = await mount(
				<Button className="w-[132px]" size="L" variant="tab">
					<PlugSrc />
					Label
				</Button>,
			);
			const screenshot = await button.screenshot();
			expect(screenshot).toMatchSnapshot(["tab", "default.png"], {
				maxDiffPixels: 88,
			});
		});
		test("hover", async ({ mount }) => {
			const button = await mount(
				<Button className="w-[132px]" size="L" variant="tab">
					<PlugSrc />
					Label
				</Button>,
			);
			await button.hover();
			const screenshot = await button.screenshot({ animations: "disabled" });
			expect(screenshot).toMatchSnapshot(["tab", "hover.png"], {
				maxDiffPixels: 89,
			});
		});
		test("disabled", async ({ mount }) => {
			const button = await mount(
				<Button className="w-[132px]" size="L" disabled={true} variant="tab">
					<PlugSrc />
					Label
				</Button>,
			);
			const screenshot = await button.screenshot();
			expect(screenshot).toMatchSnapshot(["tab", "disabled.png"], {
				maxDiffPixels: 89,
			});
		});
		test.describe("group", () => {
			test("2", async ({ mount }) => {
				const button = await mount(
					<div className="flex w-fit flex-row gap-1">
						<Button className="w-[129.5px]" size="L" variant="tab">
							<PlugSrc />
							Label
						</Button>
						<Button
							className="w-[129.5px]"
							size="L"
							variant="tab"
							disabled={true}
						>
							<PlugSrc />
							Label
						</Button>
					</div>,
				);
				const screenshot = await button.screenshot();
				expect(screenshot).toMatchSnapshot(["tab", "group", "2.png"], {
					maxDiffPixels: 252,
				});
			});
			test("3", async ({ mount }) => {
				const button = await mount(
					<div className="flex w-fit flex-row gap-1">
						<Button className="w-[128.67px]" size="L" variant="tab">
							<PlugSrc />
							Label
						</Button>
						<Button
							className="w-[128.67px]"
							size="L"
							variant="tab"
							disabled={true}
						>
							<PlugSrc />
							Label
						</Button>
						<Button
							className="w-[128.67px]"
							size="L"
							variant="tab"
							disabled={true}
						>
							<PlugSrc />
							Label
						</Button>
					</div>,
				);
				const screenshot = await button.screenshot();
				expect(screenshot).toMatchSnapshot(["tab", "group", "3.png"], {
					maxDiffPixels: 362,
				});
			});
			test("4", async ({ mount }) => {
				const button = await mount(
					<div className="flex w-fit flex-row gap-1">
						<Button className="w-[95.5px]" size="L" variant="tab">
							<PlugSrc />
							Label
						</Button>
						<Button
							className="w-[95.5px]"
							size="L"
							variant="tab"
							disabled={true}
						>
							<PlugSrc />
							Label
						</Button>
						<Button
							className="w-[95.5px]"
							size="L"
							variant="tab"
							disabled={true}
						>
							<PlugSrc />
							Label
						</Button>
						<Button
							className="w-[95.5px]"
							size="L"
							variant="tab"
							disabled={true}
						>
							<PlugSrc />
							Label
						</Button>
					</div>,
				);
				const screenshot = await button.screenshot();
				expect(screenshot).toMatchSnapshot(["tab", "group", "4.png"], {
					maxDiffPixels: 572,
				});
			});
		});
	});
});
