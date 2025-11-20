/**
 * Vitestのテストファイル - TodoFiltersコンポーネント
 * 
 * このファイルはVitestを使用してTodoFiltersコンポーネントの動作をテストします
 */

// Vitestから必要な関数をインポート
import { describe, it, expect, vi, beforeEach } from 'vitest'
// describe: テストスイート（テストのグループ）を定義
// it: 個別のテストケースを定義（testと同じ）
// expect: アサーション（期待値の検証）を行う
// vi: モック関数やスパイを作成するためのユーティリティ
// beforeEach: 各テストの前に実行される処理を定義

// Vue Test Utilsからmount関数をインポート
import { mount } from '@vue/test-utils'
// mount: Vueコンポーネントをテスト環境でマウント（レンダリング）する

import { ref } from 'vue'
import TodoFilters from './TodoFilters.vue'

// useTodosコンポーザブルをモック化
// モック: テスト用の偽のデータや関数を作成し、実際の実装を置き換える
const mockFilter = ref('all') // 現在のフィルター状態（all/active/completed）
const mockActiveCount = ref(3) // アクティブなTodoの数
const mockCompletedCount = ref(2) // 完了したTodoの数
const mockSetFilter = vi.fn() // フィルター設定関数のモック（vi.fn()で呼び出しを追跡可能）
const mockClearCompleted = vi.fn() // 完了済みTodo削除関数のモック

// vi.mock: モジュール全体をモック化する
// 実際のuseTodosの代わりに、テスト用のモックデータを返す
vi.mock('~/composables/useTodos', () => ({
    useTodos: () => ({
        filter: mockFilter,
        activeCount: mockActiveCount,
        completedCount: mockCompletedCount,
        setFilter: mockSetFilter,
        clearCompleted: mockClearCompleted,
    }),
}))

// describe: テストスイートの定義（関連するテストケースをグループ化）
describe('TodoFilters', () => {
    // beforeEach: 各テストケースの実行前に毎回実行される
    // テストの独立性を保つため、モックの状態を初期化する
    beforeEach(() => {
        mockFilter.value = 'all' // フィルターを初期状態に戻す
        mockActiveCount.value = 3 // アクティブ数をリセット
        mockCompletedCount.value = 2 // 完了数をリセット
        vi.clearAllMocks() // すべてのモック関数の呼び出し履歴をクリア
    })

    // テストケース1: すべてのフィルターボタンが正しくレンダリングされるか
    it('renders all filter buttons', () => {
        // mount: コンポーネントをテスト環境でレンダリング
        const wrapper = mount(TodoFilters)
        // findAll: 指定したCSSセレクタに一致するすべての要素を取得
        const buttons = wrapper.findAll('.filter-button')

        // expect: 期待値を検証（アサーション）
        expect(buttons).toHaveLength(3) // ボタンが3つあることを確認
        // [0]!: 配列の最初の要素を取得（!は非null断言演算子）
        expect(buttons[0]!.text()).toContain('All') // 1つ目のボタンに「All」が含まれる
        expect(buttons[1]!.text()).toContain('Active') // 2つ目のボタンに「Active」が含まれる
        expect(buttons[2]!.text()).toContain('Completed') // 3つ目のボタンに「Completed」が含まれる
    })

    // テストケース2: バッジに正しい数が表示されるか
    it('shows correct counts in badges', () => {
        const wrapper = mount(TodoFilters)
        const badges = wrapper.findAll('.count-badge')

        expect(badges[0]!.text()).toBe('5') // All: 3 active + 2 completed
        expect(badges[1]!.text()).toBe('3') // Active
        expect(badges[2]!.text()).toBe('2') // Completed
    })

    // テストケース3: アクティブなフィルターに正しくactiveクラスが付与されるか
    it('active filter has active class', () => {
        mockFilter.value = 'active' // フィルターを「active」に設定
        const wrapper = mount(TodoFilters)
        const buttons = wrapper.findAll('.filter-button')

        // classes(): 要素に付与されているCSSクラスの配列を取得
        expect(buttons[0]!.classes()).not.toContain('active') // Allボタンはactiveではない
        expect(buttons[1]!.classes()).toContain('active') // Activeボタンがactiveクラスを持つ
        expect(buttons[2]!.classes()).not.toContain('active') // Completedボタンはactiveではない
    })

    // テストケース4: フィルターボタンをクリックしたときにsetFilter関数が呼ばれるか
    it('calls setFilter when filter button is clicked', async () => {
        const wrapper = mount(TodoFilters)
        const activeButton = wrapper.findAll('.filter-button')[1]! // Activeボタンを取得

        // trigger: DOM イベントを発火させる（async/awaitで非同期処理を待つ）
        await activeButton.trigger('click')

        // toHaveBeenCalledWith: モック関数が指定した引数で呼ばれたことを検証
        expect(mockSetFilter).toHaveBeenCalledWith('active')
    })

    // テストケース5: 完了済みTodoがあるときにClear Completedボタンが表示されるか
    it('shows Clear Completed button when there are completed todos', () => {
        mockCompletedCount.value = 2 // 完了済みTodoが2つある状態
        const wrapper = mount(TodoFilters)

        // find: 指定したセレクタに一致する最初の要素を取得
        // exists(): 要素が存在するかどうかを真偽値で返す
        expect(wrapper.find('.clear-button').exists()).toBe(true)
    })

    // テストケース6: 完了済みTodoがないときにClear Completedボタンが非表示になるか
    it('hides Clear Completed button when no completed todos', () => {
        mockCompletedCount.value = 0 // 完了済みTodoが0個の状態
        const wrapper = mount(TodoFilters)

        // ボタンが存在しないことを確認（条件付きレンダリングのテスト）
        expect(wrapper.find('.clear-button').exists()).toBe(false)
    })

    // テストケース7: Clear CompletedボタンをクリックしたときにclearCompleted関数が呼ばれるか
    it('calls clearCompleted when Clear Completed button is clicked', async () => {
        mockCompletedCount.value = 2
        const wrapper = mount(TodoFilters)
        const clearButton = wrapper.find('.clear-button')

        await clearButton.trigger('click') // クリックイベントを発火

        // toHaveBeenCalled: モック関数が呼ばれたことを検証（引数は問わない）
        expect(mockClearCompleted).toHaveBeenCalled()
    })

    // テストケース8: 3つすべてのフィルターが選択可能か
    it('all three filters can be selected', async () => {
        const wrapper = mount(TodoFilters)
        const buttons = wrapper.findAll('.filter-button')

        expect(buttons).toHaveLength(3)

        // 各ボタンをクリックして、正しい引数でsetFilterが呼ばれることを確認
        await buttons[0]!.trigger('click')
        expect(mockSetFilter).toHaveBeenCalledWith('all')

        await buttons[1]!.trigger('click')
        expect(mockSetFilter).toHaveBeenCalledWith('active')

        await buttons[2]!.trigger('click')
        expect(mockSetFilter).toHaveBeenCalledWith('completed')
    })
})
