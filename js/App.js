export default function App($element) {
    this.state = {
        users : [
            { id:'r4r3e', name: 'Woojung'},
            { id:'kgit9', name: 'Paul'},
            { id:'vh8r7', name: 'tester'}
        ]
    }
    this.$element = $element;
    this.$draggingElement = null;

    this.setState = ({ users }) => {
        if(users){
            this.state.users = users ?? [];
        }
        this.render();
    }

    this.bindEvents = () => {

        const handleDragStart = (e) => {
            this.$draggingElement = e.target;
        }

        const handleDragOver = (e) => {
            if (e.preventDefault) {
            e.preventDefault();
            }
            return false;
        }

        const handleDragEnter = (e) => {
            if(e.target.nodeName !== 'div' && !e.target.classList.contains('draggable')){
                const $target = e.target.closest('.draggable') ?? null;
                $target && $target.classList.add('over');
            }
        }

        const handleDragLeave = (e) => {
            if(e.target.nodeName !== 'div' && !e.target.classList.contains('draggable')){
                const $target = e.target.closest('.draggable') ?? null;
                $target && $target.classList.remove('over');
            }
        }

        const handleDrop = (e) => {
            if (e.stopPropagation) {
            e.stopPropagation();
            }

            let $target = null
            if(e.target.nodeName !== 'div' && !e.target.classList.contains('draggable')){
                $target = e.target.closest('.draggable') ?? null;
            }
            
            if(!$target){
                return;
            }
            
            if (this.$draggingElement !== $target) {
                const {users} = this.state; 
                const targetIdx = $target.dataset.idx;
                const draggingIdx = this.$draggingElement.dataset.idx;
                const temp = users[targetIdx];
                users[targetIdx] = users[draggingIdx];
                users[draggingIdx] = temp;

                this.setState({
                    users,
                })
            }
            
            return;
        }

        const handleDragEnd = (e) => {
            const $items = [...this.$element.querySelectorAll('.draggable')];
            $items && $items.forEach(function ($item) {
            $item.classList.remove('over');
            });
        }

        this.$element.addEventListener('dragstart', handleDragStart, false);
        this.$element.addEventListener('dragenter', handleDragEnter, false);
        this.$element.addEventListener('dragover', handleDragOver, false);
        this.$element.addEventListener('dragleave', handleDragLeave, false);
        this.$element.addEventListener('drop', handleDrop, false);
        this.$element.addEventListener('dragend', handleDragEnd, false);
    }

    const pinnedProfileComponent = (user, mode, idx) => {
        const profileNumber = idx + 1;
        return `
                ${mode === 3 && idx === 1 ? '<div id="profile-bottom-wrapper">' : ''}
                <div id="profile-wrapper" class="profile-wrapper item-${idx}-${mode}">
                    <div class="draggable" draggable="true" data-idx="${idx}" data-id="${user.id}">
                        <div class="profile-header">
                            <p class="popup-profile-number">${profileNumber}</p>
                            <p class="popup-profile-name">${user.name}</p>
                        </div>
                        <div id="popup-profile-default-picture" class="popup-profile-default-picture">
                            <img draggable="false" class="profile-sample">
                        </div>
                    </div>
                </div>
                ${mode === 3 && idx === 2 ? '</div>' : ''} `;
            
    }

    const emptyPinnedProfileComponent = () => {
        return `<div id="popup-profile-warning">
                    <div id="popup-profile-warning-picture" class="popup-profile-warning-picture">
                        <img draggable="false" class="warning-sample">
                    </div>
                    <div id="popup-profile-warning-notice">
                        <p class="warning-title">정보 없음</p>
                    </div>
                </div>
                `;
    }

    const setComponent = (users) => {
        return `<p class="profile-notice">드래그로 순서를 변경해 보세요!</p>`
        + (users.map((user, index) => pinnedProfileComponent(user, users.length, index))).join(""); 

    }


    this.render = () => {
        const { users } = this.state;

        const template = users.length ? 
        setComponent(users)
        : emptyPinnedProfileComponent();
        this.$element.innerHTML = template;
    }
    
    this.init = () => {
        this.render();
        this.bindEvents();
    }

    this.init();
}