import JpgIcon from "@/icons/jpg.svg?react";
import PngIcon from "@/icons/png.svg?react";
import TrashIcon from "@/icons/trash.svg?react";

import clsx from "clsx";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

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
	onDelete,
	defaultItem,
}: {
	className?: string;
	label: string;
	required: boolean;
	onSelect?: (file?: File) => void;
	onDelete?: () => void;
	defaultItem?: File | null;
}) {
	const { t } = useTranslation(["main"]);
	const [fileSelected, setFileSelected] = useState<File | null>(
		defaultItem || null,
	);
	const inputRef = useRef<HTMLInputElement | null>(null);

	const uploadData = useMemo(() => {
		if (!fileSelected) return { format: "", size: "", desc: "", value: false };
		const size = getSize(fileSelected.size);
		const format = fileSelected.name.split(".").pop();
		if (fileSelected.size > 1000000)
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
			<label className="flex w-full cursor-pointer flex-col overflow-hidden font-droid text-base text-current">
				<span
					data-required={required}
					className="mb-3 font-droid text-text-primary text-xs after:ml-0.5 after:text-negative-primary data-[required=true]:after:content-['*']"
				>
					{label}
				</span>
				<span
					data-visible={fileSelected !== null}
					className="mb-2 flex flex-row items-end gap-2 text-nowrap px-2 data-[visible=false]:justify-between "
				>
					{uploadData.format === "jpg" && (
						<JpgIcon className="min-w-4 fill-text-primary group-data-[invalid=true]:fill-text-quartinary" />
					)}
					{uploadData.format === "png" && (
						<PngIcon className="min-w-4 fill-text-primary group-data-[invalid=true]:fill-text-quartinary" />
					)}
					<span
						data-visible={fileSelected !== null}
						className="mt-[6px] max-w-full truncate text-text-primary leading-[14px] transition-colors group-data-[invalid=true]:text-text-quartinary"
					>
						{fileSelected ? (
							fileSelected.name
						) : (
							<span className="text-text-secondary">{t("selectFile")}</span>
						)}
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
							setFileSelected(file);
							onSelect?.(file);
						}
					}}
				/>
				<div className="h-px w-full bg-fill-secondary transition-colors group-hover:bg-fill-quaternary group-data-[invalid=true]:bg-negative-primary" />
				<span className="hidden text-negative-primary text-xs group-data-[invalid=true]:block">
					{uploadData.desc}
				</span>
			</label>

			{fileSelected && (
				<button
					type="button"
					className="mt-auto mb-1 ml-2 flex size-6 cursor-pointer items-center justify-center rounded-[2px] bg-fill-brand-primary-700 transition-all"
					onClick={() => {
						if (!inputRef.current) return;
						inputRef.current.value = "";
						setFileSelected(null);
						onSelect?.(undefined);
						onDelete?.();
					}}
				>
					<TrashIcon className="text-text-primary" width={11} height={11} />
				</button>
			)}
		</div>
	);
}

export { FileInput };
