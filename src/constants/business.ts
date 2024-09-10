import { transformRecordToOption } from "@/utils/common"

export const enableStatusRecord: Record<Api.Common.EnableStatus, string> = {
  1: "启用",
  2: "禁用"
}

export const enableStatusOptions = [
  {
    label: "启用",
    value: true
  },
  {
    label: "禁用",
    value: false
  }
]

export const userGenderRecord: Record<SystemManage.UserGender, string> = {
  1: "男",
  2: "女"
}

export const userGenderOptions = transformRecordToOption(userGenderRecord)

export const menuTypeRecord: Record<SystemManage.MenuType, string> = {
  1: "目录",
  2: "菜单"
}

export const menuTypeOptions = transformRecordToOption(menuTypeRecord)

export const menuIconTypeRecord: Record<SystemManage.IconType, string> = {
  1: "iconify图标",
  2: "本地图标"
}

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord)
