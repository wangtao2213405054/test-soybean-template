/**
 * Transform record to option
 *
 * @example
 *   ;```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```
 *
 * @param record
 */
export function transformRecordToOption<T extends Record<string | number, string>>(record: T) {
  return Object.entries(record).map(([key, label]) => ({
    value: Number.isNaN(Number(key)) ? key : Number(key), // 检查 key 是否是数字类型，保留原始类型
    label
  }))
}

/**
 * Translate options
 *
 * @param options
 */
export function translateOptions(options: CommonType.Option[]) {
  return options.map((option) => ({
    ...option,
    label: option.label
  }))
}

/**
 * Toggle html class
 *
 * @param className
 */
export function toggleHtmlClass(className: string) {
  function add() {
    document.documentElement.classList.add(className)
  }

  function remove() {
    document.documentElement.classList.remove(className)
  }

  return {
    add,
    remove
  }
}

export function addIsLeafToTreeNodes(data: Api.Common.TreeNode[]) {
  return data.map((node) => {
    if (node.children && node.children.length > 0) {
      node.isLeaf = false
      node.children = addIsLeafToTreeNodes(node.children)
    } else {
      node.isLeaf = true
    }
    return node
  })
}
