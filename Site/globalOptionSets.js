console.log('global Option Sets file')

class GlobalOptionSet {
    constructor() {
        this.dummyData()
        this.showListAll()
        this.addListeners()
    }
    dummyData () {
        this.data = [
            {
                name: 'Status',
                values: ['Inactive', 'Active', 'In Progress']
            }
        ]
    }
    showListAll() {
        let html = `
            <div class='container-fluid'>
                <div class='row'>
                    <div class='col-xs-12 col-md-12 col-lg-6 col-xl-6'>
                        <button class='btn btn-primary data-launch-new-option-set-btn'>Add New</button>
                        <table>
                            <thead>
                                <th>Name</th>
                                <th>Length</th>
                                <th>Values</th>
                                <th>Dependencies</th>
                            </thead>
                            <tbody>`
        this.data.forEach(row => {
            html +=       `     <tr>
                                    <td>${row.name}</td>
                                    <td>${row.values.length}</td>`
                                    row.values.forEach(val => {
                                        html += `<td>${val} |</td>`
                                    })
            html +=       `
                                    <td>Under construction</td>
                                </tr>
                                `
        })
        html += `</tbody></table>`             
        html += `   </div>
                </div>
            </div>`
        document.getElementById('globalOptionSetsPage').innerHTML = html
    }
    newForm () {
        console.log('hit  NEW FORM')
        let html = `<div class='container-fluid'>
                        <div class='row'>
                            <div class='col-xs-12 col-md-12 col-lg-6 col-xl-6'>
                                <div class='data-launch-new-option-set-form-field-cont'>
                                    <input type='text' placeholder='Option Set Name' class='data-launch-new-option-set-form-field-input'>
                                </div>
                                <div class='data-launch-new-option-set-form-field-cont'>
                                    <button class='btn data-launch-new-option-set-form-add-value-btn'>+</button>
                                    <ul id='globalOptionSetValuesContainer'>
                                        <li><input type='text' placeholder='New value' class='data-launch-new-option-set-form-field-input'></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`
        document.getElementById('globalOptionSetsPage').innerHTML = html
    }
    addListeners () {
        document.getElementById('globalOptionSetsPage').addEventListener('click', (event) => {
            if (event.target.classList.contains('data-launch-new-option-set-btn')) {
                console.log('show new option set form')
                this.newForm()
            }
            else if (event.target.classList.contains('data-launch-new-option-set-form-add-value-btn')) {
                console.log('hit the data-launch-new-option-set-form-add-value-btn')
                let html = `<li><input type='text' placeholder='New value' class='data-launch-new-option-set-form-field-input'></li>`
                document.getElementById('globalOptionSetValuesContainer').innerHTML += html
            }
            else if (event.target.classList.contains('blah blah')) {
                console.log('hit the blah blah')
            }
        })
    }
    
}