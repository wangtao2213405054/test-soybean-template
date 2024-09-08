import { transformRecordToOption } from "@/utils/common"

export const enableStatusRecord: Record<Api.Common.EnableStatus, string> = {
  1: "启用",
  2: "禁用"
}

export const enableStatusOptions = transformRecordToOption(enableStatusRecord)

export const userGenderRecord: Record<SystemManage.UserGender, App.I18n.I18nKey> = {
  "1": "page.manage.user.gender.male",
  "2": "page.manage.user.gender.female"
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
