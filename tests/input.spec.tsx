import { Input, InputDescription, InputLabel } from "@/components/ui/input";
import { expect, test } from "@playwright/experimental-ct-react";

test.describe("input", () => {
	test.describe("empty", () => {
		test("default", async ({ mount }) => {
			const input = await mount(
				<div className="max-w-[250px]">
					<Input data-testid="input" placeholder="Example">
						<InputLabel>Label</InputLabel>
					</Input>
				</div>,
			);
			const screenshot = await input.screenshot();
			expect(screenshot).toMatchSnapshot(["empty", "default.png"], {
				maxDiffPixels: 293,
			});
		});
		test("empty hover", async ({ mount }) => {
			const input = await mount(
				<div className="max-w-[250px]">
					<Input placeholder="Example">
						<InputLabel>Label</InputLabel>
					</Input>
				</div>,
			);
			await input.hover();
			const screenshot = await input.screenshot({ animations: "disabled" });
			expect(screenshot).toMatchSnapshot(["empty", "hover.png"], {
				maxDiffPixels: 293,
			});
		});
		test("empty active", async ({ mount }) => {
			const input = await mount(
				<div className="max-w-[250px]">
					<Input placeholder="Example">
						<InputLabel>Label</InputLabel>
					</Input>
				</div>,
			);
			await input.click();
			const screenshot = await input.screenshot({ animations: "disabled" });
			expect(screenshot).toMatchSnapshot(["empty", "active.png"], {
				maxDiffPixels: 99,
			});
		});
		test("empty active validation", async ({ mount }) => {
			const input = await mount(
				<div className="max-w-[250px]">
					<Input
						placeholder="Example"
						formNoValidate={true}
						data-invalid="true"
					>
						<InputLabel>Label</InputLabel>
						<InputDescription className="peer-data-[invalid=true]:text-negative-primary">
							<div>Validation</div>
						</InputDescription>
					</Input>
				</div>,
			);
			await input.click();
			const screenshot = await input.screenshot({ animations: "disabled" });
			expect(screenshot).toMatchSnapshot(["empty", "validation.png"], {
				maxDiffPixels: 320,
			});
		});
		test("empty disabled", async ({ mount }) => {
			const input = await mount(
				<div className="max-w-[250px]">
					<Input disabled={true} placeholder="Example">
						<InputLabel>Label</InputLabel>
					</Input>
				</div>,
			);
			const screenshot = await input.screenshot();
			expect(screenshot).toMatchSnapshot(["empty", "disabled.png"], {
				maxDiffPixels: 293,
			});
		});
	});
	test.describe("filled", () => {
		test("default", async ({ mount, page }) => {
			const wholeInput = await mount(
				<div className="max-w-[250px]">
					<Input data-testid="input" placeholder="Example">
						<InputLabel>Label</InputLabel>
					</Input>
				</div>,
			);
			const input = page.getByTestId("input");
			await input.fill("Example");
			const screenshot = await wholeInput.screenshot();
			expect(screenshot).toMatchSnapshot(["filled", "default.png"], {
				maxDiffPixels: 543,
			});
		});
		test("empty hover", async ({ mount, page }) => {
			const wholeInput = await mount(
				<div className="max-w-[250px]">
					<Input data-testid="input" placeholder="Example">
						<InputLabel>Label</InputLabel>
					</Input>
				</div>,
			);
			const input = page.getByTestId("input");
			await input.fill("Example");
			await input.hover();
			const screenshot = await wholeInput.screenshot({
				animations: "disabled",
			});
			expect(screenshot).toMatchSnapshot(["filled", "hover.png"], {
				maxDiffPixels: 543,
			});
		});
		test("empty active", async ({ mount, page }) => {
			const wholeInput = await mount(
				<div className="max-w-[250px]">
					<Input data-testid="input" placeholder="Example">
						<InputLabel>Label</InputLabel>
					</Input>
				</div>,
			);
			const input = page.getByTestId("input");
			await input.fill("Example");
			await input.click();
			const screenshot = await wholeInput.screenshot({
				animations: "disabled",
			});
			expect(screenshot).toMatchSnapshot(["filled", "active.png"], {
				maxDiffPixels: 308,
			});
		});
		test("empty active validation", async ({ mount, page }) => {
			const wholeInput = await mount(
				<div className="max-w-[250px]">
					<Input data-testid="input" placeholder="Example" data-invalid="true">
						<InputLabel>Label</InputLabel>
						<InputDescription className="peer-data-[invalid=true]:text-negative-primary">
							<div>Validation</div>
						</InputDescription>
					</Input>
				</div>,
			);
			const input = page.getByTestId("input");
			await input.fill("Example");
			await input.click();
			const screenshot = await wholeInput.screenshot({
				animations: "disabled",
			});
			expect(screenshot).toMatchSnapshot(["filled", "validation.png"], {
				maxDiffPixels: 529,
			});
		});
		test("empty disabled", async ({ mount, page }) => {
			const wholeInput = await mount(
				<div className="max-w-[250px]">
					<Input
						data-testid="input"
						disabled={true}
						placeholder="Example"
						value={"Example"}
					>
						<InputLabel>Label</InputLabel>
					</Input>
				</div>,
			);
			const input = page.getByTestId("input");
			const screenshot = await wholeInput.screenshot();
			expect(screenshot).toMatchSnapshot(["filled", "disabled.png"], {
				maxDiffPixels: 293,
			});
		});
	});
});
