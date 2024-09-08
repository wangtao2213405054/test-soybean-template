import { transformRecordToOption } from "@/utils/common"

// 是/否记录，映射 YesOrNo 类型到国际化键
export const yesOrNoRecord: Record<CommonType.YesOrNo, string> = {
  Y: "是",
  N: "否"
}

// 将是/否记录转换为选项列表
export const yesOrNoOptions = transformRecordToOption(yesOrNoRecord)
