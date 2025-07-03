interface ComponentProps {
  [key: string]: any;
}

interface ComponentState {
  [key: string]: any;
}

export abstract class Component<
  P extends ComponentProps = {},
  S extends ComponentState = {}
> {
  protected props: P;
  protected state: S;
  protected $container: HTMLElement | null = null;
  protected children: Map<string, Component> = new Map();
  private isMounted: boolean = false;
  private isFirstRender: boolean = true;
  private prevState: S | null = null;
  private updateScheduled: boolean = false;

  constructor(props: P = {} as P) {
    this.props = props;
    this.state = {} as S;
    this.prevState = { ...this.state };

    this.isMounted = false;
    this.isFirstRender = true;
    this.created();
  }

  /**
   * 컴포넌트의 템플릿을 반환하는 추상 메서드
   * @returns {string} - HTML 문자열
   */
  abstract template(): string;

  /**
   * @param container - 렌더링 위치 container
   */
  public async mount(container: HTMLElement): Promise<void> {
    if (this.isMounted) {
      console.warn("Component is already mounted.");
      return;
    }
    this.$container = container;
    this.render();
    await this.onMounted();
    this.isMounted = true;
  }

  /**
   * @description 컴포넌트를 언마운트하고 자식 컴포넌트 정리
   */
  public unmount(): void {
    if (!this.isMounted) {
      console.warn("Component is not mounted.");
      return;
    }
    this.cleanUp();
    this.children.forEach((child) => child.unmount());
    this.children.clear();
    this.isMounted = false;

    if (this.$container) {
      this.$container.innerHTML = "";
      this.$container = null;
    }
  }

  /**
   * @description 컴포넌트의 렌더링 및 이벤트 바인딩
   */
  protected render(): void {
    if (!this.$container) {
      console.error(
        "Container is not set. Call setContainer() before rendering."
      );
      return;
    }

    if (this.isFirstRender) {
      this.performInitialRender();
      this.isFirstRender = false;
    } else {
      this.performUpdate();
    }

    // this.$container.innerHTML = this.template();
    // this.bindEvents();
  }

  /**
   * @description 초기 렌더링을 수행
   */
  private performInitialRender(): void {
    this.$container!.innerHTML = this.template();
    this.mountChildren();
    this.bindEvents();
  }

  private performUpdate(): void {
    if (!this.hasStateChanged()) {
      return;
    }

    this.updateDynamicContent();
    this.updateChildComponents();

    if (this.shouldRebindEvents()) {
      this.rebindEvents();
    }

    this.prevState = { ...this.state };
  }

  private hasStateChanged(): boolean {
    return JSON.stringify(this.state) !== JSON.stringify(this.prevState);
  }

  protected updateChildComponents(): void {
    this.children.forEach((child, _) => {
      if (this.shouldUpdateChild()) {
        child.update();
      }
    });

    this.mountNewChildren();
  }

  /**
   *
   * @param key - 자식 컴포넌트의 키
   * @description 자식 컴포넌트의 업데이트 여부를 결정하는 메서드
   *
   */
  protected shouldUpdateChild(): boolean {
    return true;
  }

  /**
   * @description 컴포넌트의 상태를 업데이트하고 렌더링
   * @param newState - 업데이트할 상태의 부분 객체
   */
  protected setState(newState: Partial<S>): void {
    this.state = { ...this.state, ...newState };
    if (this.isMounted && !this.updateScheduled) {
      console.log("State updated:", this.state);
      this.updateScheduled = true;

      Promise.resolve().then(() => {
        this.updateScheduled = false;
        this.update();
      });
    }
  }

  /**
   * @description 컴포넌트의 상태를 업데이트하고 렌더링
   * render 메서드를 호출하여 컴포넌트를 다시 렌더링
   * 추후 상태 변경 로직을 최적화할 수 있음
   */
  protected update(): void {
    this.render();
  }

  /**
   * @param childComponent - 자식 컴포넌트 클래스
   * @param props - 자식 컴포넌트에 전달할 속성
   * @param selector - 자식 컴포넌트를 마운트할 DOM 요소의 선택자
   * @param key - 자식 컴포넌트를 식별하기 위한 키 (선택적)
   * @returns {T} - 마운트된 자식 컴포넌트 인스턴스
   */
  protected addChild<T extends Component>(
    childComponent: new (props: any) => T,
    props: any,
    parent: string,
    key?: string
  ): T {
    const parentElement = this.$container?.querySelector(parent);
    if (!parentElement) {
      throw new Error(`Parent element not found for selector: ${parent}`);
    }

    const childKey = key || `${childComponent.name}-${Date.now()}`;

    if (this.children.has(childKey)) {
      this.children.get(childKey)?.unmount();
    }

    const childContainer = new childComponent(props);
    childContainer.mount(parentElement as HTMLElement);
    this.children.set(childKey, childContainer);
    return childContainer;
  }

  /**
   * @description 자식 컴포넌트 조회 및 반환
   */
  protected getChild<T extends Component>(key: string): T | undefined {
    return this.children.get(key) as T;
  }

  protected hasChild(key: string): boolean {
    return this.children.has(key);
  }

  protected removeChild(key: string): void {
    const child = this.children.get(key);
    if (child) {
      child.unmount();
      this.children.delete(key);
    }
  }

  /**
   * @param selector - CSS 선택자
   * @param text - 업데이트할 텍스트 내용
   * @description 선택한 요소의 텍스트 콘텐츠를 업데이트
   */
  protected updateTextContent(selector: string, text: string): void {
    const element = this.$container?.querySelector(selector);
    if (element && element.textContent !== text) {
      element.textContent = text;
    }
  }

  /**
   *
   * @param selector - CSS 선택자
   * @param attribute - 업데이트할 속성 이름
   * @param value - 업데이트할 속성 값
   */
  protected updateAttribute(
    selector: string,
    attribute: string,
    value: string
  ): void {
    const element = this.$container?.querySelector(selector);
    if (element && element.getAttribute(attribute) !== value) {
      element.setAttribute(attribute, value);
    }
  }

  /**
   *
   * @param selector - CSS 선택자
   * @param className - 업데이트할 클래스 이름
   * @param shouldAdd - 클래스를 추가할지 여부 (true: 추가, false: 제거)
   */
  protected updateClass(
    selector: string,
    className: string,
    shouldAdd: boolean
  ): void {
    const element = this.$container?.querySelector(selector);
    if (element) {
      if (shouldAdd) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    }
  }

  protected updateStyle(
    selector: string,
    property: string,
    value: string
  ): void {
    const element = this.$container?.querySelector(selector) as HTMLElement;
    if (element && element.style[property as any] !== value) {
      element.style[property as any] = value;
    }
  }

  protected batchUpdate(updates: Array<() => void>): void {
    requestAnimationFrame(() => {
      updates.forEach((update) => update());
    });
  }

  /**
   * @description 컴포넌트의 이벤트를 바인딩
   * 사용하는 컴포넌트에서 오버라이드하여 이벤트 핸들러를 정의
   */
  protected bindEvents(): void {}

  /**
   * @description 자식 컴포넌트를 마운트
   * 사용하는 컴포넌트에서 오버라이드하여 자식 컴포넌트를 마운트할 수 있음
   */
  protected mountChildren(): void {}

  /**
   * @description 동적 콘텐츠 업데이트를 위한 메서드
   * 사용하는 컴포넌트에서 오버라이드하여 동적 콘텐츠를 업데이트할 수 있음
   */
  protected updateDynamicContent(): void {}

  /**
   * @description 새로운 자식 컴포넌트를 마운트
   * 사용하는 컴포넌트에서 오버라이드하여 새로운 자식 컴포넌트를 마운트할 수 있음
   */
  protected mountNewChildren(): void {}

  protected shouldRebindEvents(): boolean {
    return false;
  }

  /**
   * @description 이벤트를 다시 바인딩
   * 사용하는 컴포넌트에서 오버라이드하여 이벤트를 다시 바인딩할 수 있음
   */
  protected rebindEvents(): void {}

  /**
   * @description 컴포넌트 마운트 작업 Dom과 연관된 이벤트 바인딩
   * 사용하는 컴포넌트에서 오버라이드하여 마운트 작업을 수행
   */
  protected onMounted(): void | Promise<void> {}

  /**
   * @description 컴포넌트 생성 작업
   * 사용하는 컴포넌트에서 오버라이드하여 생성 작업을 수행
   */
  protected created(): void {}

  /**
   * @description 컴포넌트의 정리 작업
   * 사용하는 컴포넌트에서 오버라이드하여 정리 작업을 수행
   */
  protected cleanUp(): void {}
}
