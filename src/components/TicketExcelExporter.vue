<template>
  <div class="flex items-center gap-2">
    <a-dialog
      :manual-open="exportDialogOpen"
      @open="exportDialogOpen = true"
      @close="exportDialogOpen = false"
    >
      <template #trigger>
        <button class="actions-button" :title="'Export tickets to Excel'" @click="openExportDialog">
          <i class="fa fa-file-excel" />
        </button>
      </template>

      <template #content>
        <div
          class="flex flex-col gap-5 m-auto w-11/12 md:w-8/12 lg:w-7/12 xl:w-6/12 max-h-80vh overflow-y-scroll scrollbar-hide bg-secondary-500 border border-primary-500 rounded-md p-5 text-white"
        >
          <div class="flex items-center justify-between gap-3">
            <h1 class="text-xl font-bold" v-text="'Export tickets'" />
            <span
              class="text-sm"
              v-text="`${filteredExportTickets.length} of ${allTickets.length} tickets`"
            />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <label class="flex flex-col gap-1 font-bold">
              <span v-text="'Date field'" />
              <select v-model="exportDateField" class="rounded-md text-black px-2 py-1">
                <option
                  v-for="field in exportDateFieldOptions"
                  :key="field.key"
                  :value="field.key"
                  v-text="field.label"
                />
              </select>
            </label>

            <label class="flex flex-col gap-1 font-bold">
              <span v-text="'From'" />
              <input v-model="exportDateFrom" type="date" class="rounded-md text-black px-2 py-1" />
            </label>

            <label class="flex flex-col gap-1 font-bold">
              <span v-text="'To'" />
              <input v-model="exportDateTo" type="date" class="rounded-md text-black px-2 py-1" />
            </label>
          </div>

          <div class="flex items-center justify-between border-b border-primary-500 pb-2">
            <span class="font-bold" v-text="'Ticket fields'" />
            <div class="flex items-center gap-4">
              <button
                class="hover:text-primary-500 hover:underline"
                :title="'Select every field.'"
                v-text="'Select all'"
                @click="selectAllExportFields"
              />
              <button
                class="hover:text-primary-500 hover:underline"
                :title="'Clear every selected field.'"
                v-text="'Clear all'"
                @click="clearExportFields"
              />
            </div>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 max-h-60vh overflow-y-scroll scrollbar-hide"
          >
            <a-checkbox
              v-for="field in exportFields"
              :key="`${field.key}-${selectedExportFields.includes(field.key)}`"
              :the-value="selectedExportFields.includes(field.key)"
              :label="field.label"
              :title="`Toggle ${field.label}`"
              @changed="(value) => toggleExportField(field.key, value)"
            />
          </div>

          <div class="flex items-center justify-between gap-3 border-t border-primary-500 pt-4">
            <button
              class="hover:text-primary-500 hover:underline"
              :title="'Clear date filters.'"
              v-text="'Clear dates'"
              @click="clearExportDateFilters"
            />
            <button
              class="primary-button px-4 py-2 rounded-md disabled:opacity-50"
              :disabled="!selectedExportFieldObjects.length"
              :title="'Export selected tickets and fields.'"
              @click="exportTickets"
            >
              <i class="fa fa-file-excel mr-1" />
              <span v-text="'Export'" />
            </button>
          </div>
        </div>
      </template>
    </a-dialog>

    <button
      class="actions-button"
      :title="'Export tickets with graph sheets'"
      @click="exportTicketsWithGraphs()"
    >
      <i class="fa fa-chart-column" />
    </button>
  </div>
</template>

<script lang="ts">
import { get, groupBy } from 'lodash'
import format from 'date-fns/format'
import { defineComponent } from 'vue'
import writeXlsxFile from 'write-excel-file'
import ADialog from '@/components/general/ADialog.vue'
import ACheckbox from '@/components/general/ACheckbox.vue'

export default defineComponent({
  name: 'TicketExcelExporter',

  components: { ACheckbox, ADialog },

  emits: ['startExport', 'finishExport'],

  props: {
    allTickets: {
      type: Array,
      required: false,
      default: () => []
    }
  },

  data() {
    return {
      exportDialogOpen: false,
      exportDateField: 'created_at',
      exportDateFrom: '',
      exportDateTo: '',
      selectedExportFields: [] as string[],
      exportFieldSelectionTouched: false,
      monthLabels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    }
  },

  computed: {
    statuses(): any {
      return Object.values(this.$information?.storedStatuses ?? {}) ?? []
    },
    customFields() {
      const fields = new Set<string>()

      this.allTickets.forEach((ticket) => {
        Object.keys(ticket?.custom_fields ?? {}).forEach((field) => fields.add(field))
      })

      return Array.from(fields)
    },
    exportDateFieldOptions() {
      return [
        { key: 'created_at', label: 'Created at' },
        { key: 'updated_at', label: 'Updated at' },
        { key: 'due_by', label: 'Due by' }
      ]
    },
    exportFields() {
      return [
        { key: 'id', label: 'ID' },
        { key: 'subject', label: 'Subject' },
        { key: 'created_at', label: 'Created at' },
        { key: 'updated_at', label: 'Updated at' },
        { key: 'due_by', label: 'Due by' },
        { key: 'requester', label: 'Requester' },
        { key: 'type', label: 'Type' },
        { key: 'tags', label: 'Tags' },
        { key: 'status', label: 'Status' },
        ...this.customFields.map((field) => ({
          key: `custom_fields.${field}`,
          label: this.titleCase(field),
          customField: field
        }))
      ]
    },
    selectedExportFieldObjects() {
      return this.exportFields.filter((field) => this.selectedExportFields.includes(field.key))
    },
    filteredExportTickets() {
      if (!this.exportDateFrom && !this.exportDateTo) {
        return this.allTickets
      }

      const fromDate = this.exportDateFrom ? new Date(`${this.exportDateFrom}T00:00:00`) : null
      const toDate = this.exportDateTo ? new Date(`${this.exportDateTo}T23:59:59.999`) : null

      return this.allTickets.filter((ticket) => {
        const ticketDate = new Date(get(ticket, this.exportDateField))

        if (Number.isNaN(ticketDate.getTime())) {
          return false
        }

        if (fromDate && ticketDate < fromDate) {
          return false
        }

        if (toDate && ticketDate > toDate) {
          return false
        }

        return true
      })
    }
  },

  methods: {
    openExportDialog() {
      const availableFieldKeys = this.exportFields.map((field) => field.key)
      this.selectedExportFields = this.selectedExportFields.filter((fieldKey) =>
        availableFieldKeys.includes(fieldKey)
      )

      if (!this.exportFieldSelectionTouched || !this.selectedExportFields.length) {
        this.setAllExportFields()
      }

      this.exportDialogOpen = true
    },

    async exportTickets() {
      if (!this.selectedExportFieldObjects.length) {
        return
      }

      await this.writeWorkbook(
        this.buildTicketsSheet(this.filteredExportTickets, this.selectedExportFieldObjects),
        {
          fileName: 'ticket_export_' + format(new Date(), 'dd_MM_yyyy') + '.xlsx'
        }
      )

      this.exportDialogOpen = false
    },

    setAllExportFields() {
      this.selectedExportFields = this.exportFields.map((field) => field.key)
    },

    selectAllExportFields() {
      this.exportFieldSelectionTouched = true
      this.setAllExportFields()
    },

    clearExportFields() {
      this.exportFieldSelectionTouched = true
      this.selectedExportFields = []
    },

    toggleExportField(fieldKey: string, selected: boolean) {
      this.exportFieldSelectionTouched = true

      if (selected && !this.selectedExportFields.includes(fieldKey)) {
        this.selectedExportFields = [...this.selectedExportFields, fieldKey]
        return
      }

      if (!selected) {
        this.selectedExportFields = this.selectedExportFields.filter(
          (selectedField) => selectedField !== fieldKey
        )
      }
    },

    clearExportDateFilters() {
      this.exportDateFrom = ''
      this.exportDateTo = ''
    },

    async exportTicketsWithGraphs() {
      await this.writeWorkbook(
        [this.buildTicketsSheet(this.allTickets, this.exportFields), this.buildGraphsSheet()],
        {
          fileName: 'ticket_graph_export_' + format(new Date(), 'dd_MM_yyyy') + '.xlsx',
          sheets: ['Tickets', 'Graphs']
        }
      )
    },

    async writeWorkbook(data, options: any) {
      this.$emit('startExport')

      await writeXlsxFile(data, options).finally(() => {
        this.$emit('finishExport')
      })
    },

    buildTicketsSheet(tickets = this.allTickets, fields = this.exportFields) {
      let headers = this.buildHeadersRow(fields)
      const exportData = [headers]

      tickets.forEach((ticket) => {
        let row = this.buildExportRow(ticket, fields)

        exportData.push(row)
      })

      return exportData
    },

    buildGraphsSheet() {
      const monthlyRows = this.monthLabels.map((month, index) => {
        const createdTickets = this.countTicketsByMonth(index, 'created_at')
        const closedTickets = this.countTicketsByMonth(index, 'stats.closed_at', 'Closed')
        const resolvedTickets = this.countTicketsByMonth(index, 'stats.resolved_at', 'Resolved')

        return {
          month,
          createdTickets,
          closedTickets,
          resolvedTickets,
          finishedTickets: closedTickets + resolvedTickets
        }
      })
      const statusRows = this.buildStatusSummaryRows()

      const monthlyStartRow = 3
      const monthlyEndRow = monthlyStartRow + monthlyRows.length - 1
      const statusStartRow = monthlyEndRow + 4
      const statusEndRow = statusStartRow + statusRows.length - 1

      return [
        [this.titleCell('Monthly ticket trends'), null, null, null, null, null, null],
        [
          this.headerCell('Month'),
          this.headerCell('Created tickets'),
          this.headerCell('Closed & resolved tickets'),
          this.headerCell('Closed tickets'),
          this.headerCell('Resolved tickets'),
          this.headerCell('Created graph'),
          this.headerCell('Closed & resolved graph')
        ],
        ...monthlyRows.map((row, index) => {
          const worksheetRow = monthlyStartRow + index

          return [
            this.textCell(row.month),
            this.numberCell(row.createdTickets),
            this.numberCell(row.finishedTickets),
            this.numberCell(row.closedTickets),
            this.numberCell(row.resolvedTickets),
            this.formulaCell(
              this.graphBarFormula(`B${worksheetRow}`, `$B$${monthlyStartRow}:$B$${monthlyEndRow}`)
            ),
            this.formulaCell(
              this.graphBarFormula(`C${worksheetRow}`, `$C$${monthlyStartRow}:$C$${monthlyEndRow}`)
            )
          ]
        }),
        [],
        [this.titleCell('Status totals', 3), null, null],
        [this.headerCell('Status'), this.headerCell('Ticket count'), this.headerCell('Graph')],
        ...statusRows.map((row, index) => {
          const worksheetRow = statusStartRow + index

          return [
            this.textCell(row.label),
            this.numberCell(row.count),
            this.formulaCell(
              this.graphBarFormula(`B${worksheetRow}`, `$B$${statusStartRow}:$B$${statusEndRow}`)
            )
          ]
        })
      ]
    },

    buildExportRow(ticket: any, fields: Array<any>) {
      return fields.map((field) => this.buildExportCell(ticket, field))
    },

    buildExportCell(ticket: any, field: any) {
      const customFieldName = field?.customField

      if (customFieldName) {
        return {
          type: String,
          value: this.formatExportText(ticket?.custom_fields?.[customFieldName], 'N/A')
        }
      }

      const exportCells: Record<string, any> = {
        id: {
          type: Number,
          align: 'center',
          value: ticket?.id
        },
        subject: {
          type: String,
          value: this.formatExportText(ticket?.subject)
        },
        created_at: {
          type: Date,
          align: 'center',
          value: new Date(ticket?.created_at),
          format: 'dd-mm-yyyy'
        },
        updated_at: {
          type: Date,
          align: 'center',
          value: new Date(ticket?.updated_at),
          format: 'dd-mm-yyyy'
        },
        due_by: {
          type: Date,
          align: 'center',
          value: new Date(ticket?.due_by),
          format: 'dd-mm-yyyy'
        },
        requester: {
          type: String,
          value: this.formatExportText(ticket?.requester?.name)
        },
        type: {
          type: String,
          value: this.formatExportText(ticket?.type)
        },
        tags: {
          type: String,
          value: this.formatExportText(
            ticket?.tags?.length ? ticket?.tags?.toString() : null,
            'N/A'
          )
        },
        status: {
          type: String,
          value: this.formatExportText(this.getStatusLabel(ticket?.status))
        }
      }

      return (
        exportCells[field.key] ?? {
          type: String,
          value: ''
        }
      )
    },

    buildHeadersRow(fields: Array<any>) {
      return fields.map((field) => ({
        value: field.label,
        fontWeight: 'bold'
      }))
    },

    formatExportText(value: any, fallback: string = '') {
      if (value === null || value === undefined || value === '') {
        return fallback
      }

      return String(value)
    },

    getStatusLabel(statusId: string) {
      return this.statuses.find((status) => status?.id == statusId)?.label ?? statusId
    },

    findStatusId(statusLabel: String) {
      return this.statuses.find((status) => {
        return status?.label == statusLabel || status?.value == statusLabel
      })?.id
    },

    countTicketsByMonth(monthIndex: number, dateField: string, statusLabel: String = '') {
      const statusId = statusLabel ? this.findStatusId(statusLabel) : null

      if (statusLabel && !statusId) {
        return 0
      }

      return this.allTickets.filter((ticket) => {
        if (statusId && ticket?.status != statusId) {
          return false
        }

        const date = new Date(get(ticket, dateField))

        return !Number.isNaN(date.getTime()) && date.getMonth() == monthIndex
      }).length
    },

    buildStatusSummaryRows() {
      const ticketCountsByStatus = groupBy(this.allTickets, 'status')
      const storedStatusRows = this.statuses.map((status) => ({
        id: status?.id,
        label: status?.label ?? status?.value ?? `Status ${status?.id}`,
        count: ticketCountsByStatus[status?.id]?.length ?? 0
      }))
      const storedStatusIds = storedStatusRows.map((status) => String(status.id))
      const unknownStatusRows = Object.keys(ticketCountsByStatus)
        .filter((statusId) => !storedStatusIds.includes(String(statusId)))
        .map((statusId) => ({
          id: statusId,
          label: `Status ${statusId}`,
          count: ticketCountsByStatus[statusId]?.length ?? 0
        }))

      const statusRows = [...storedStatusRows, ...unknownStatusRows]
        .filter((status) => status.count > 0)
        .sort((a, b) => b.count - a.count)

      return statusRows.length ? statusRows : [{ label: 'No tickets', count: 0 }]
    },

    graphBarFormula(cellReference: String, dataRange: String) {
      return `IF(MAX(${dataRange})=0,"",REPT("|",ROUND(${cellReference}/MAX(${dataRange})*30,0)))`
    },

    titleCell(value: String, span: number = 7) {
      return {
        type: String,
        value,
        fontWeight: 'bold',
        fontSize: 14,
        span
      }
    },

    headerCell(value: String) {
      return {
        type: String,
        value,
        fontWeight: 'bold',
        align: 'center',
        backgroundColor: '#e5e7eb'
      }
    },

    textCell(value: String) {
      return {
        type: String,
        value
      }
    },

    numberCell(value: number) {
      return {
        type: Number,
        value,
        align: 'center'
      }
    },

    formulaCell(value: String) {
      return {
        type: 'Formula',
        value,
        fontFamily: 'Consolas'
      }
    },

    titleCase(word: String) {
      return String(word)
        .replace('_', ' ')
        .replace('_', ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
  }
})
</script>
