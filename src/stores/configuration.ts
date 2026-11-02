import { defineStore } from 'pinia'
import { migrateLayout, type DashboardPanel } from '@/helpers/LayoutGrid'
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage
} from '@/helpers/LocalStorageStore'

const storeLocalStorageKey = 'stored_configuration'

export const configuration = defineStore('configuration', {
  state: () => ({
    autoRefresh: {
      active: false,
      perMinutes: 0
    },
    leaderboards: {
      length: 5,
      showThrophies: true,
      trophyIcon: 'fa fa-trophy'
    },
    layout: {
      autoHideToolbar: true,
      visibleTicketCounts: [] as any[],
      component: 'grid-layout',
      panels: [] as DashboardPanel[]
    }
  }),

  getters: {
    theLayout(): any {
      return this.layout
    },
    theAutoRefresh(): any {
      return this.autoRefresh
    },
    autoHideToolbar(): boolean {
      return this.layout?.autoHideToolbar
    },
    layoutPanels(): DashboardPanel[] {
      return this.layout?.panels ?? []
    },
    layoutComponent(): string {
      return this.layout?.component
    },
    trophyIcon(): string {
      return this.leaderboards?.trophyIcon
    },
    showTrophies(): boolean {
      return this.leaderboards?.showThrophies
    },
    leaderboardsLength(): number {
      return this.leaderboards?.length
    },
    visibleTicketCounts(): Array<any> {
      return this.layout?.visibleTicketCounts
    }
  },

  actions: {
    updateLayout(layout: Array<any>) {
      this.layout = layout
      this.saveConfigurationToStore()
    },

    updateLayoutPanels(panels: DashboardPanel[]) {
      this.layout.panels = panels
      this.saveConfigurationToStore()
    },

    updatePanel(panelId: string, changes: Partial<DashboardPanel>) {
      const panel = this.layout?.panels?.find((panel) => panel.id == panelId)

      if (panel) {
        Object.assign(panel, changes)
        this.saveConfigurationToStore()
      }
    },

    updateVisibleStatuses(visibleCounts: Array<any>) {
      this.layout.visibleTicketCounts = visibleCounts
      this.saveConfigurationToStore()
    },

    updateAutoRefreshSettings(autoRefresh: any) {
      this.autoRefresh = autoRefresh
      this.saveConfigurationToStore()
    },

    updateLeaderboardSettings(leaderboards: any) {
      this.leaderboards = leaderboards
      this.saveConfigurationToStore()
    },

    saveConfigurationToStore() {
      saveToLocalStorage(storeLocalStorageKey, {
        layout: this.layout,
        autoRefresh: this.autoRefresh,
        leaderboards: this.leaderboards
      })
    },

    initializeConfigurationFromStorage() {
      const configurationFromStore = loadFromLocalStorage(storeLocalStorageKey)

      if (configurationFromStore) {
        this.layout = migrateLayout(configurationFromStore?.layout) ?? this.layout
        this.autoRefresh = configurationFromStore?.autoRefresh
        this.leaderboards = configurationFromStore?.leaderboards
      }
    },

    deleteStoredConfiguration() {
      removeFromLocalStorage(storeLocalStorageKey)
    }
  }
})
