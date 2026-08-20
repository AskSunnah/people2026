// src/components/common/QuestionItemSkeleton.jsx

/**
 * Mirrors QuestionItem's box shape (border, side accent, padding) so the
 * loading state doesn't jump in size once real content replaces it.
 * Render a handful of these (e.g. Array.from({ length: 5 })) while loading.
 */
const QuestionItemSkeleton = ({ direction = "ltr" }) => {
  const isRTL = direction === "rtl";

  return (
    <div
      className={`
        mt-4 sm:mt-6 p-3 sm:p-4 rounded-[5px]
        border border-[#eee] bg-[#fefefe]
        animate-pulse
        ${isRTL ? "border-r-[5px] border-r-[#e4e4e4]" : "border-l-[5px] border-l-[#e4e4e4]"}
      `}
    >
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-full mb-2" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
    </div>
  );
};

export default QuestionItemSkeleton;
