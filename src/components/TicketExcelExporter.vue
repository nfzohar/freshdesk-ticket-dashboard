<template>
  <div class="flex items-center gap-2">
    <button class="actions-button" :title="'Export tickets to Excel'" @click="exportTickets()">
      <i class="fa fa-file-excel" />
    </button>
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
import { clone, get, groupBy } from 'lodash'
import format from 'date-fns/format'
import { defineComponent } from 'vue'
import writeXlsxFile from 'write-excel-file'

export default defineComponent({
  name: 'TicketExcelExporter',

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
      defaultHeaders: [
        'ID',
        'Subject',
        'Created at',
        'Updated at',
        'Due by',
        'Requester',
        'Type',
        'Tags',
        'Status'
      ],
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
      const firstTicketWithCustomFields = this.allTickets?.find?.((ticket) => ticket?.custom_fields)

      return Object.keys(firstTicketWithCustomFields?.custom_fields ?? {}) ?? []
    }
  },

  methods: {
    async exportTickets() {
      await this.writeWorkbook(this.buildTicketsSheet(), {
        fileName: 'ticket_export_' + format(new Date(), 'dd_MM_yyyy') + '.xlsx'
      })
    },

    async exportTicketsWithGraphs() {
      await this.writeWorkbook([this.buildTicketsSheet(), this.buildGraphsSheet()], {
        fileName: 'ticket_graph_export_' + format(new Date(), 'dd_MM_yyyy') + '.xlsx',
        sheets: ['Tickets', 'Graphs']
      })
    },

    async writeWorkbook(data, options: any) {
      this.$emit('startExport')

      await writeXlsxFile(data, options).finally(() => {
        this.$emit('finishExport')
      })
    },

    buildTicketsSheet() {
      let headers = this.buildHeadersRow()
      const exportData = [headers]

      this.allTickets.forEach((ticket) => {
        let row = this.buildExportRow(ticket)

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

    buildExportRow(ticket: Object) {
      let basicRow = [
        // ID
        {
          type: Number,
          align: 'center',
          value: ticket?.id
        },
        // Subject
        {
          type: String,
          value: ticket?.subject
        },
        // Created at
        {
          type: Date,
          align: 'center',
          value: new Date(ticket?.created_at),
          format: 'dd-mm-yyyy'
        },
        // Updated at
        {
          type: Date,
          align: 'center',
          value: new Date(ticket?.updated_at),
          format: 'dd-mm-yyyy'
        },
        // Due by
        {
          type: Date,
          align: 'center',
          value: new Date(ticket?.due_by),
          format: 'dd-mm-yyyy'
        },
        // Requester
        {
          type: String,
          value: ticket?.requester?.name
        },
        // Type
        {
          type: String,
          value: ticket?.type
        },
        // Tags
        {
          type: String,
          value: ticket?.tags?.length ? ticket?.tags?.toString() : 'N/A'
        },
        // Status
        {
          type: String,
          value: this.getStatusLabel(ticket?.status)
        }
      ]

      if (this.customFields?.length) {
        this.customFields.forEach((field) => {
          basicRow.push({
            type: String,
            value: ticket?.custom_fields[field] || 'N/A'
          })
        })
      }

      return basicRow
    },

    buildHeadersRow() {
      let headers = []
      let template = {
        value: '',
        fontWeight: 'bold'
      }

      this.defaultHeaders.forEach((header) => {
        let aHeader = clone(template)
        aHeader.value = header
        headers.push(aHeader)
      })

      if (this.customFields?.length) {
        this.customFields.forEach((field) => {
          let customFieldHeader = clone(template)
          customFieldHeader.value = this.titleCase(field)
          headers.push(customFieldHeader)
        })
      }

      return headers
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
