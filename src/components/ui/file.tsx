import JpgIcon from "@/icons/jpg.svg?react";
import PngIcon from "@/icons/png.svg?react";
import clsx from "clsx";
import { useMemo, useRef, useState } from "react";

const getSize = (size: number): `${string}${"b" | "kb" | "mb"}` => {
	if (size < 1000) return `${size}b`;
	if (size < 1000000) return `${(size / 1000).toFixed(2)}kb`;
	return `${(size / 1000000).toFixed(2)}mb`;
};

function FileInput({
	className,
	required,
	label,
	onSelect,
}: {
	className?: string;
	label: string;
	required: boolean;
	onSelect?: (file: File) => void;
}) {
	const [fileSelected, setFileSelected] = useState<FileList | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const uploadData = useMemo(() => {
		if (!fileSelected || fileSelected.length === 0)
			return { format: "", size: "", desc: "", value: false };
		const size = getSize(fileSelected[0].size);
		const format = fileSelected[0].name.split(".").pop();
		if (fileSelected[0].size > 1000000)
			return {
				format,
				size,
				desc: "File too large",
				value: true,
			};
		if (format !== "jpg" && format !== "png")
			return {
				format,
				size,
				desc: "Invalid format",
				value: true,
			};
		return { format, size, desc: "", value: false };
	}, [fileSelected]);

	return (
		<div
			data-invalid={uploadData.value}
			className={clsx(
				className,
				"group flex flex-row overflow-hidden text-text-secondary hover:text-fill-brand-secondary-500",
			)}
		>
			<label className="flex w-full cursor-pointer flex-col gap-3 overflow-hidden font-droid text-base text-current">
				<span
					data-required={required}
					className="font-droid text-text-primary text-xs after:ml-0.5 after:text-negative-primary data-[required=true]:after:content-['*']"
				>
					{label}
				</span>
				<span
					data-visible={fileSelected !== null}
					className="flex flex-row items-end gap-2 text-nowrap px-2 data-[visible=false]:justify-between"
				>
					{uploadData.format === "jpg" && (
						<JpgIcon className="min-w-4 fill-text-primary group-data-[invalid=true]:fill-text-quartinary" />
					)}
					{uploadData.format === "png" && (
						<PngIcon className="min-w-4 fill-text-primary group-data-[invalid=true]:fill-text-quartinary" />
					)}
					<span
						data-visible={fileSelected !== null}
						className="max-w-full truncate text-text-secondary leading-[14px] transition-colors group-data-[invalid=true]:text-text-quartinary"
					>
						{fileSelected ? fileSelected[0].name : "Select file"}
					</span>
					<span
						data-visible={fileSelected !== null}
						className="text-secondary text-xs leading-[12px] data-[visible=false]:hidden group-data-[invalid=true]:text-text-quartinary"
					>
						{uploadData.size}
					</span>
					<div
						data-visible={fileSelected !== null}
						className="size-4 bg-[url(/icons/upload.svg)] bg-cover bg-no-repeat data-[visible=true]:hidden"
					/>
				</span>
				<input
					ref={inputRef}
					type="file"
					className="hidden"
					accept="image/jpg, image/png"
					onChange={(e) => {
						e.preventDefault();
						const file = e.target.files?.[0];
						if (file) {
							setFileSelected(e.target.files);
							onSelect?.(file);
						}
					}}
				/>
				<div className="h-px w-full bg-fill-secondary transition-colors group-hover:bg-fill-quaternary group-data-[invalid=true]:bg-negative-primary" />
				<span className="hidden text-negative-primary text-xs group-data-[invalid=true]:block">
					{uploadData.desc}
				</span>
			</label>

			<button
				type="button"
				data-visible={fileSelected !== null}
				className="-mr-6 mt-px aspect-square size-6 cursor-pointer bg-[url(/icons/delete.svg)] bg-cover bg-no-repeat transition-all data-[visible=true]:mr-0 data-[visible=true]:ml-2"
				onClick={() => {
					if (!inputRef.current) return;
					inputRef.current.value = "";
					setFileSelected(null);
					onSelect?.(null);
				}}
			/>
		</div>
	);
}

export { FileInput };
