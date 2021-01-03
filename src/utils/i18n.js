import { useIntl } from "react-intl"

const useI18n = () => {
  const { formatMessage, formatNumber, formatDate } = useIntl()
  const f = (id) => formatMessage({ id })
  return { f, fn: formatNumber, fd: formatDate }
}

export default useI18n
