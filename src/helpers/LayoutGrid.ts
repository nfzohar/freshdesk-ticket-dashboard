// Panel layout model for the dashboard grid.
//
// A layout is a flat list of panels, each with a position on a 12-column grid
// (x, y, w, h in grid units). Older saved layouts stored panels in row or column
// "groups"; migrateLayout() converts those on load.

export const GRID_COLUMNS = 12
export const GRID_ROW_HEIGHT = 32
export const GRID_GAP = 16

export interface DashboardPanel {
  id: string
  component: string
  displayType: string
  visible: boolean
  sortBy: string | object
  data: Record<string, any>
  x: number
  y: number
  w: number
  h: number
}

interface PanelSize {
  w: number
  h: number
  minW: number
  minH: number
}

const panelSizes: Record<string, PanelSize> = {
  TicketCounters: { w: 12, h: 3, minW: 3, minH: 3 },
  LatestTicket: { w: 4, h: 5, minW: 3, minH: 4 },
  AgentsLeaderboard: { w: 6, h: 7, minW: 3, minH: 4 },
  RequestersLeaderboard: { w: 6, h: 7, minW: 3, minH: 4 }
}
const defaultPanelSize: PanelSize = { w: 4, h: 9, minW: 3, minH: 4 }

export function panelSize(component: string): PanelSize {
  return panelSizes[component] ?? defaultPanelSize
}

export function newPanelId(existingIds: string[] = []): string {
  let id = ''
  do {
    id = String(Math.floor(Math.random() * 100000))
  } while (existingIds.includes(id))
  return id
}

// First free row below every panel.
export function bottomRow(panels: { y: number; h: number }[]): number {
  return panels.reduce((bottom, panel) => Math.max(bottom, panel.y + panel.h), 0)
}

export function createPanel(component: string, panels: DashboardPanel[] = []): DashboardPanel {
  const { w, h } = panelSize(component)

  return {
    id: newPanelId(panels.map((panel) => panel.id)),
    component,
    displayType: 'default',
    visible: true,
    sortBy: '',
    data: {},
    x: 0,
    y: bottomRow(panels),
    w,
    h
  }
}

// Reading order (top to bottom, left to right), used by the mobile and carousel layouts.
export function panelsInReadingOrder(panels: DashboardPanel[] = []): DashboardPanel[] {
  return [...panels].sort((a, b) => a.y - b.y || a.x - b.x)
}

export function presetPanels(): DashboardPanel[] {
  const panels: DashboardPanel[] = []
  const add = (
    component: string,
    displayType: string,
    x: number,
    y: number,
    w: number,
    h: number
  ) => panels.push({ ...createPanel(component, panels), displayType, x, y, w, h })

  add('TicketCounters', 'default', 0, 0, 12, 3)
  add('TicketTypesList', 'v-bar', 0, 3, 4, 9)
  add('TicketTagsList', 'h-bar', 4, 3, 4, 9)
  add('TicketGroupsList', 'default', 8, 3, 4, 9)
  add('AgentsLeaderboard', 'default', 0, 12, 6, 7)
  add('RequestersLeaderboard', 'default', 6, 12, 6, 7)

  return panels
}

// Split the 12 grid columns as evenly as possible between `count` panels.
function splitColumns(count: number): { x: number; w: number }[] {
  const base = Math.floor(GRID_COLUMNS / count)
  let x = 0

  return Array.from({ length: count }, (_, index) => {
    const w = index == count - 1 ? GRID_COLUMNS - x : base
    const column = { x, w }
    x += w
    return column
  })
}

function groupsToPanels(groups: any[][], component: string): DashboardPanel[] {
  const panels: DashboardPanel[] = []
  const usable = groups
    .map((group) => (group ?? []).filter((panel: any) => panel?.component))
    .filter((group) => group.length)

  const toPanel = (panel: any, x: number, y: number, w: number): DashboardPanel => ({
    id: String(panel.id ?? newPanelId(panels.map((p) => p.id))),
    component: panel.component,
    displayType: panel.displayType ?? 'default',
    visible: panel.visible ?? true,
    sortBy: panel.sortBy ?? '',
    data: panel.data ?? {},
    x,
    y,
    w,
    h: panelSize(panel.component).h
  })

  if (component == 'columns-layout') {
    // Each group was a column: panels stack vertically inside it.
    splitColumns(usable.length).forEach(({ x, w }, column) => {
      let y = 0
      usable[column].forEach((panel: any) => {
        const converted = toPanel(panel, x, y, w)
        panels.push(converted)
        y += converted.h
      })
    })
    return panels
  }

  // Each group was a row: panels share the row's width.
  let y = 0
  usable.forEach((group) => {
    const columns = splitColumns(group.length)
    const row = group.map((panel: any, index: number) =>
      toPanel(panel, columns[index].x, y, columns[index].w)
    )
    panels.push(...row)
    y += Math.max(...row.map((panel) => panel.h))
  })
  return panels
}

// Bring a stored layout up to the current shape. Safe to run on an already-migrated layout.
export function migrateLayout(layout: any) {
  if (!layout) {
    return layout
  }

  if (!Array.isArray(layout.panels)) {
    layout.panels = groupsToPanels(layout.groups ?? [], layout.component)
  }
  delete layout.groups

  if (layout.component == 'rows-layout' || layout.component == 'columns-layout') {
    layout.component = 'grid-layout'
  }

  // Fill in positions for any panel that is missing one.
  layout.panels.forEach((panel: DashboardPanel, index: number) => {
    if ([panel.x, panel.y, panel.w, panel.h].some((value) => typeof value != 'number')) {
      const size = panelSize(panel.component)
      Object.assign(panel, {
        x: 0,
        y: bottomRow(layout.panels.slice(0, index)),
        w: size.w,
        h: size.h
      })
    }
  })

  return layout
}
