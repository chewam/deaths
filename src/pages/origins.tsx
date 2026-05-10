import { useIntl } from "react-intl"
import { useRouter } from "next/router"

import Origins, { type OriginsViewLabels } from "@/components/views/Origins"
import useRawOrigins from "@/services/raw-origins"

const Page = () => {
  const intl = useIntl()
  const router = useRouter()
  const { data } = useRawOrigins()

  if (!data) return null

  const labels: OriginsViewLabels = {
    bornInFrance: intl.formatMessage({ id: "origins.bornInFrance" }),
    bornAbroad: intl.formatMessage({ id: "origins.bornAbroad" }),
    distinctCountries: intl.formatMessage({ id: "origins.distinctCountries" }),
    topOrigin: intl.formatMessage({ id: "origins.topOrigin" }),
    deathsByOrigin: intl.formatMessage({ id: "origins.deathsByOrigin" }),
    franceExcluded: intl.formatMessage({ id: "origins.franceExcluded" }),
    franceExcludedShort: intl.formatMessage({
      id: "origins.franceExcludedShort",
    }),
    topCountries: intl.formatMessage({ id: "origins.topCountries" }),
    ofForeignTotal: intl.formatMessage({ id: "origins.ofForeignTotal" }),
    loading: intl.formatMessage({ id: "origins.loading" }),
    loadError: intl.formatMessage({ id: "origins.loadError" }),
  }

  return (
    <div className="container mx-auto flex min-h-0 flex-1 flex-col px-6">
      <Origins data={data} labels={labels} locale={router.locale || "en"} />
    </div>
  )
}

export default Page
