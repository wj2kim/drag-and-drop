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

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', e.target.innerHTML);
        }

        const handleDragOver = (e) => {
            if (e.preventDefault) {
            e.preventDefault();
            }

            e.dataTransfer.dropEffect = 'move';
            
            return false;
        }

        const handleDragEnter = (e) => {
            if(e.target.nodeName !== 'div' && !e.target.classList.contains('draggable')){
                const target = e.target.closest('.draggable');
                target.classList.add('over');
            }
        }

        const handleDragLeave = (e) => {
            if(e.target.nodeName !== 'div' && !e.target.classList.contains('draggable')){
                const target = e.target.closest('.draggable');
                target.classList.remove('over');
            }
        }

        const handleDrop = (e) => {
            if (e.stopPropagation) {
            e.stopPropagation();
            }
            let target = null
            if(e.target.nodeName !== 'div' && !e.target.classList.contains('draggable')){
                target = e.target.closest('.draggable')
            }
            
            if (this.$draggingElement !== target) {
                const users = this.state.users; 
                const targetUserId = target.dataset.id;
                const draggingUserId = this.$draggingElement.dataset.id;

                console.log(users, targetUserId, draggingUserId);

            this.$draggingElement.innerHTML = target.innerHTML;
            target.innerHTML = e.dataTransfer.getData('text/html');
            }

            const newUsersOrder = [...document.querySelectorAll('div.draggable')].map(user => user.dataset.id);
            console.log('neww', newUsersOrder);
            
            return false;
        }

        const handleDragEnd = (e) => {
            
            items.forEach(function (item) {
            item.classList.remove('over');
            });
        }


        const items = this.$element.querySelectorAll('.draggable');
        items.forEach(function(item) {
            item.addEventListener('dragstart', handleDragStart, false);
            item.addEventListener('dragenter', handleDragEnter, false);
            item.addEventListener('dragover', handleDragOver, false);
            item.addEventListener('dragleave', handleDragLeave, false);
            item.addEventListener('drop', handleDrop, false);
            item.addEventListener('dragend', handleDragEnd, false);
        });
    }

    const pinnedProfileComponent = (user, mode, idx) => {
        return `
                ${mode === 3 && idx === 2 ? '<div id="profile-bottom-wrapper">' : ''}
                <div id="profile-wrapper" class="profile-wrapper item-${idx}-${mode}">
                    <div class="draggable" draggable="true" data-id="${user.name}">
                        <div class="profile-header">
                            <p class="popup-profile-number">${idx}</p>
                            <p class="popup-profile-name">${user.name}</p>
                        </div>
                        <div id="popup-profile-default-picture" class="popup-profile-default-picture">
                            <img draggable="false" class="profile-sample">
                        </div>
                    </div>
                </div>
                ${mode === 3 && idx === 3 ? '</div>' : ''} `;
            
    }

    const emptyPinnedProfileComponent = () => {
        return `<div id="popup-profile-warning">
                    <div id="popup-profile-warning-picture" class="popup-profile-warning-picture">
                        <img draggable="false" class="warning-sample">
                    </div>
                    <div id="popup-profile-warning-notice">
                        <p class="warning-title">없음</p>
                    </div>
                </div>
                `;
    }

    const setComponent = (users) => {
        return `<p class="profile-notice">드래그로 순서를 변경 할 수 있습니다.</p>`
        + (users.map((user, index) => pinnedProfileComponent(user, users.length, ++index))).join(""); 

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