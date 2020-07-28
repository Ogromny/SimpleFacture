<template lang="pug">
v-app
    v-app-bar(app)
        v-container
            v-row
                v-toolbar-title Simple Facture
                v-spacer
                v-btn(text color="blue darken-4" @click="generate_invoice") Générer la facture
    v-main
        v-container
            v-row
                v-col
                    v-text-field(
                        v-model="filigramme" solo hint="Filigramme" persistent-hint
                        prepend-inner-icon="mdi-format-color-text")
                v-col
                    v-file-input(
                        ref="photo" solo hint="Logo" accept="image/*" persistent-hint
                        prepend-icon="" prepend-inner-icon="mdi-image")

            v-row
                v-col
                    v-divider.my-4

            v-row
                v-col(sm="4")
                    v-textarea(
                        v-model="society" auto-grow outlined 
                        label="Votre société et votre adresse"
                        hide-details)
                v-col(sm="4" offset-sm="4")
                    v-textarea(
                        v-model="client" 
                        label="Le client et son adresse" 
                        auto-grow outlined hide-details)
            v-row(justify="center")
                v-col(sm="6")
                    v-input.elevation-2.rounded-pill(hide-details outlined)
                        v-text-field.rounded-l-0(
                            v-model="invoice_number"
                            prefix="numéro" filled dense hide-details rounded)
                        template(slot="prepend")
                            v-select.rounded-r-0(
                                v-model="credit_invoice" 
                                :items="[\
                                    {text: \"Facture\", value: false},\
                                    {text: \"Facture d'avoir\", value: true}\
                                    ]" 
                                single-line filled dense hide-details rounded)
            v-row
                v-col
                    v-textarea(
                        v-model="references_and_comments"
                        label="Réfèrences / Commentaires"
                        auto-grow outlined hide-details)

            v-row
                v-col
                    v-divider.my-4

            v-row
                v-col(sm="3")
                    v-menu(
                        min-width="290px" max-width="290px"
                        transition="scale-transition" offset-y)
                        template(v-slot:activator="{on, attrs}")
                            v-text-field(
                                v-model="date" hint="Date" solo persistent-hint
                                v-bind="attrs" v-on="on" readonly 
                                prepend-inner-icon="mdi-calendar")
                        v-date-picker(v-model="date" no-title)
                v-col(sm="3" offset-sm="6")
                    v-select(
                        v-model="currency" hint="Devise" solo persistent-hint
                        :items="[\
                            {text: \"€ (euro)\", value: \"€\"},\
                            {text: \"£ (livre sterling)\", value: \"£\"},\
                            {text: \"$ (dollar américain)\", value: \"$\"},\
                            {text: \"₽ (rouble russe)\", value: \"₽\"}\
                            ]"
                            prepend-inner-icon="mdi-cash-register")

            v-row
                v-col
                    v-divider.my-4

            v-row
                v-col
                    v-card(outlined)
                        v-data-table.elevation-2(
                            v-model="products.selected" :headers="products.headers" 
                            :items="products.items" disable-pagination 
                            hide-default-footer show-select single-select)
                            template(v-slot:footer)
                                v-toolbar(flat)
                                    v-spacer
                                    v-dialog(v-model="new_product.dialog" max-width="500px")
                                        template(v-slot:activator="{on, attrs}")
                                            v-btn(
                                                color="primary" fab small dark 
                                                v-bind="attrs" v-on="on")
                                                v-icon mdi-plus
                                            v-btn.mr-2(
                                                color="error" fab small dark 
                                                @click="delete_product") 
                                                v-icon mdi-minus
                                        v-card
                                            v-card-title
                                                span.headline Ajouter un élément
                                            v-card-text
                                                v-container
                                                    v-row
                                                        v-col
                                                            v-text-field(
                                                                v-model="new_product.buffer.ref"
                                                                hint="Réfèrence" persistent-hint)
                                                        v-col
                                                            v-text-field(
                                                                v-model="new_product.buffer.desc"
                                                                hint="Description" persistent-hint)
                                                    v-row
                                                        v-col
                                                            v-text-field(
                                                                v-model.number="new_product.buffer.up"
                                                                hint="Prix unitaire" persistent-hint
                                                                type="number")
                                                        v-col
                                                            v-text-field(
                                                                v-model.number="new_product.buffer.amount"
                                                                hint="Quantité" persistent-hint
                                                                type="number")
                                                    v-row
                                                        v-col
                                                            v-text-field(
                                                                v-model="new_product.buffer.unit"
                                                                hint="Unité de mesure" 
                                                                persistent-hint)
                                                        v-col
                                                            v-text-field(
                                                                v-model.number="new_product.buffer.discount"
                                                                hint="Remise en devise (i.e. 5.00)" 
                                                                persistent-hint type="number")
                                            v-card-actions
                                                v-spacer
                                                v-btn(
                                                    color="error" outlined 
                                                    @click="new_product.dialog = false") Annuler
                                                v-btn(
                                                    color="primary" 
                                                    @click="add_product()") Ajouter

            v-row
                v-col
                    v-divider.my-4

            v-row
                v-col(cols="12" sm="7")
                    v-row(no-gutters)
                        v-col
                            v-checkbox.ml-4(
                                v-model="show_293b"
                                label="Afficher mention \"T.V.A. non applicable,\
                                article 293 B du CGI\"")
                    v-row(no-gutters)
                        v-col
                            v-subheader Mode de paiement
                        v-col
                            v-select(
                                v-model="payment_method" solo
                                :items="[\"PayPal\", \"Carte Bancaire\",\
                                \"Espèces\", \"Virement Bancaire\", \"Chèque\"]")
                    v-row(no-gutters)
                        v-col
                            v-subheader Date limite de règlement
                        v-col
                            v-select(
                                v-model="payment_deadline" solo
                                :items="[\"À réception\",\
                                \"À 30 jours\", \"À 30 jours (fin de mois)\",\
                                \"À 45 jours\", \"À 45 jours (fin de mois)\",\
                                \"À 60 jours\", \"À 60 jours (fin de mois)\",\
                                \"À 90 jours\", \"À 90 jours (fin de mois)\"]")
                    v-row(no-gutters)
                        v-col
                            v-subheader Taux des pénalités de retard
                        v-col
                            v-textarea(v-model="late_fees" solo auto-grow)
                    v-row(no-gutters)
                        v-col
                            v-subheader Commentaires
                        v-col
                            v-textarea(v-model="pre_footer" solo auto-grow)
                v-col(cols="12" sm="5")
                    v-card.elevation-2(outlined)
                        v-container
                            v-row
                                v-col
                                    span.body-1 Sous total
                                v-col
                                    span.body-1 {{format_price(sub_total)}}
                            v-row
                                v-col
                                    span.body-1 Réduction global
                                v-col
                                    v-text-field.mt-0.pt-0(
                                        v-model.number="global_discount" type="number"
                                        hint="Remise en devise (i.e. 200.00)"
                                        persistent-hint)
                            v-row
                                v-col
                                    v-text-field.mt-0.pt-0(v-model="taxes.first.name")
                                v-col
                                    v-text-field.mt-0.pt-0(
                                        v-model.number="taxes.first.value" 
                                        hint="En pourcentage (i.e. 20)" 
                                        type="number" min="0" max="100" persistent-hint)
                            v-row
                                v-col
                                    v-text-field.mt-0.pt-0(v-model="taxes.second.name")
                                v-col
                                    v-text-field.mt-0.pt-0(
                                        v-model.number="taxes.second.value"
                                        hint="En pourcentage (i.e. 20)" 
                                        type="number" min="0" max="100" persistent-hint)
                            v-row
                                v-col
                                    span.body-1 Frais de port
                                v-col
                                    v-text-field.mt-0.pt-0(
                                        v-model.number="shipping_cost" hint="En devise (i.e. 120)" 
                                        type="number" persistent-hint)
                            v-row
                                v-col
                                    span.body-1 Total
                                v-col
                                    span.body-1 {{format_price(total)}}
                            v-row
                                v-col
                                    span.body-1 Acompte
                                v-col
                                    v-text-field.mt-0.pt-0(
                                        v-model.number="advance" hint="En devise (i.e. 500)"
                                        type="number" persistent-hint)
                            v-row
                                v-col
                                    span.body-1 Net à payer
                                v-col
                                    span.body-1 {{format_price(net_to_pay)}}

            v-row
                v-col
                    v-divider.my-4

            v-row
                v-col
                    v-textarea(v-model="footer" solo auto-grow hint="Pied de page" persistent-hint)

</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { v4 as uuidv4 } from "uuid";
import * as jsPDF from "jspdf";
import "jspdf-autotable";
import * as utils from "./utils.ts";

interface Taxe {
    name: string;
    value: number;
}
const TaxeDefault: Taxe = {
    name: "Taxe",
    value: 0,
};

interface IProductsItem {
    id: string;
    ref: string;
    desc: string;
    up: number;
    amount: number;
    unit: string;
    discount: number;
    total: number;
}
const ProductsItemDefault: IProductsItem = {
    id: "",
    ref: "",
    desc: "",
    up: 0,
    amount: 0,
    unit: "",
    discount: 0,
    total: 0,
};

interface IProducts {
    headers: { text: string; value: string }[];
    items: IProductsItem[];
    selected: IProductsItem[];
}

@Component
export default class App extends Vue {
    filigramme: string = "";
    society: string = "";
    client: string = "";
    credit_invoice: boolean = false;
    invoice_number: string = "";
    references_and_comments: string = "";
    date: string = new Date().toISOString().substr(0, 10);
    currency: string = "€";

    products: IProducts = {
        headers: [
            { text: "Réfèrence", value: "ref" },
            { text: "Description", value: "desc" },
            { text: "Prix unitaire", value: "up" },
            { text: "Quantité", value: "amount" },
            { text: "Unité", value: "unit" },
            { text: "Remise", value: "discount" },
            { text: "Total", value: "total" },
        ],
        items: [],
        selected: [],
    };
    new_product: { dialog: boolean; buffer: IProductsItem } = {
        dialog: false,
        buffer: { ...ProductsItemDefault },
    };

    global_discount: number = 0;
    taxes: { first: Taxe; second: Taxe } = {
        first: { ...TaxeDefault },
        second: { ...TaxeDefault },
    };
    shipping_cost: number = 0;
    advance: number = 0;

    show_293b: boolean = false;
    payment_method: string = "Virement Bancaire";
    payment_deadline: string = "À réception";
    late_fees: string =
        "Toute somme non payée après la date limite de paiement est susceptible de porter intérêt à un taux égal à une fois et demi le taux de l'intérêt légal.";
    pre_footer: string = "Merci de nous faire confiance.";
    footer: string = "";

    get sub_total(): number {
        return Object.values(this.products.items).reduce(
            (acc, { total }) => acc + total,
            0
        );
    }

    get total(): number {
        let total = this.sub_total - this.global_discount;

        Object.values(this.taxes).forEach(
            (taxe) => (total *= 1.0 + taxe.value / 100)
        );

        total += this.shipping_cost;

        return Math.round((total + Number.EPSILON) * 100) / 100;
    }

    get net_to_pay(): number {
        return this.total - this.advance;
    }

    delete_product(): void {
        if (!this.products.selected.length) {
            return;
        }

        const index = this.products.items.findIndex(
            (item) => item.id === this.products.selected[0].id
        );

        this.$delete(this.products.items, index);
    }

    add_product(): void {
        const up = this.new_product.buffer.up;
        const amount = this.new_product.buffer.amount;
        const discount = this.new_product.buffer.discount;
        this.new_product.buffer.total =
            Math.round((up * amount - discount + Number.EPSILON) * 100) / 100;
        this.new_product.buffer.id = uuidv4();

        this.products.items.push(this.new_product.buffer);

        this.new_product.dialog = false;
        this.new_product.buffer = { ...ProductsItemDefault };
    }

    format_price(price: number): string {
        return `${price} ${this.currency}`;
    }

    async generate_invoice(): Promise<void> {
        const invoice = new jsPDF();
        const margin = 5;
        const font_sizes = {
            filigramme: 50,
            huge: 16,
            title: 14,
            subtitle: 12,
            normal: 10,
            small: 9,
        };

        invoice.addFileToVFS("Roboto-Regular.ttf", utils.roboto_regular_data);
        invoice.addFileToVFS("Roboto-Bold.ttf", utils.roboto_bold_data);
        invoice.addFont("Roboto-Regular.ttf", "RobotoRegular", "normal");
        invoice.addFont("Roboto-Bold.ttf", "RobotoBold", "normal");
        invoice.setFont("RobotoRegular");

        let x = margin * 4;
        let y = 20 + 20 + margin;

        /* Photo */
        // @ts-ignore
        const photo = this.$refs.photo.initialValue;
        if (!!photo) {
            const readAsBase64 = (file: any) => {
                const reader = new FileReader();
                return new Promise((resolve, reject) => {
                    reader.onerror = () => {
                        reader.abort();
                        reject();
                    };
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(file);
                });
            };

            const getSize = (data: any) => {
                return new Promise<[number, number]>((resolve, reject) => {
                    const image = new Image();
                    image.onload = () => {
                        resolve([image.width, image.height]);
                    };
                    image.src = data;
                });
            };

            const data = await readAsBase64(photo);
            const size: [number, number] = await getSize(data);
            const ratio = Math.min(40 / size[0], 40 / size[1]);

            invoice.addImage(
                data,
                "PNG",
                x,
                margin,
                size[0] * ratio,
                size[1] * ratio,
                "photo",
                "NONE",
                0
            );
        }

        /* Date */
        const date = !!this.date;
        if (date) {
            const text = "Le " + this.date;
            invoice.setFont("RobotoRegular");
            invoice.setTextColor("#829AB1");
            invoice.setFontSize(font_sizes.title);

            const tmp_x =
                invoice.internal.pageSize.width -
                margin * 4 -
                invoice.getTextWidth(text);
            invoice.text(text, tmp_x, y);

            y += invoice.getTextDimensions(text).h + margin;
        }

        /* Society and Client */
        const society = !!this.society;
        const client = !!this.client;

        if (society || client) {
            let right_x = invoice.internal.pageSize.width / 2 + margin * 4;

            invoice.setTextColor("#829AB1");
            invoice.setFontSize(font_sizes.title);
            y += invoice.getTextDimensions("De").h;

            if (society) {
                invoice.text("De", x, y);
            }
            if (client) {
                invoice.text("À", right_x, y);
            }

            y += invoice.getTextDimensions("A").h * 1.75;
            invoice.setFont("RobotoBold");
            invoice.setTextColor("#102A43");
            invoice.setFontSize(font_sizes.title);

            if (society) {
                invoice.text(this.society.split(/\r?\n/)[0], x, y);
            }
            if (client) {
                invoice.text(this.client.split(/\r?\n/)[0], right_x, y);
            }

            let tmp_max = 0;
            let tmp_y = y;
            invoice.setFont("RobotoRegular");
            if (society) {
                this.society
                    .split(/\r?\n/)
                    .slice(1)
                    .forEach((line) => {
                        tmp_y += invoice.getTextDimensions(line).h * 1.25;
                        invoice.text(line, x, tmp_y);
                    });

                if (!client) {
                    y = tmp_y + margin * 3;
                } else {
                    tmp_max = tmp_y;
                    tmp_y = y;
                }
            }

            if (client) {
                this.client
                    .split(/\r?\n/)
                    .slice(1)
                    .forEach((line) => {
                        tmp_y += invoice.getTextDimensions(line).h * 1.25;
                        invoice.text(line, right_x, tmp_y);
                    });

                y = (tmp_max && tmp_max > tmp_y ? tmp_max : tmp_y) + margin * 3;
            }
        }

        /* References And Comments */
        const references_and_comments = !!this.references_and_comments;
        if (references_and_comments) {
            const text = "Réfèrences / Commentaires";
            invoice.setFont("RobotoRegular");
            invoice.setTextColor("#829AB1");
            invoice.setFontSize(font_sizes.title);
            invoice.text(text, x, y);

            const tmp_x = x + invoice.getTextWidth(text) + margin;
            const w = invoice.internal.pageSize.width - tmp_x - margin * 4;
            const h = 0.5;
            invoice.setFillColor("#BCCCDC");
            invoice.rect(
                tmp_x,
                y - invoice.getTextDimensions(text).h / 2 + 1,
                w,
                h,
                "F"
            );

            y += invoice.getTextDimensions(text).h * 1.75;
            invoice.setFontSize(font_sizes.subtitle);
            invoice.setTextColor("#102A43");
            invoice.text(this.references_and_comments, x, y);
            y +=
                invoice.getTextDimensions(this.references_and_comments).h +
                margin * 3;
        }

        /* Products */
        const products = !!this.products.items && this.products.items.length;
        if (products) {
            const columns: any[] = [];
            this.products.headers.map((product) => {
                columns.push({
                    header: product.text,
                    dataKey: product.value,
                });
            });
            const body: any[] = [];
            this.products.items.forEach((item) => {
                body.push({
                    ...item,
                    up: `${item.up.toFixed(2)} ${this.currency}`,
                    discount: `${item.discount.toFixed(2)} ${this.currency}`,
                    total: `${item.total.toFixed(2)} ${this.currency}`,
                });
            });
            // @ts-ignore
            invoice.autoTable({
                theme: "grid",
                startY: y,
                margin: {
                    top: margin,
                    left: margin * 4,
                    right: margin * 4,
                },
                showHead: "firstPage",
                body,
                columns,
                headStyles: {
                    fillColor: "#65D6AD",
                    textColor: "#014D40",
                },
                columnStyles: {
                    up: { halign: "right" },
                    discount: { halign: "right" },
                    total: { halign: "right" },
                },
            });

            // @ts-ignore
            y = invoice.lastAutoTable.finalY + margin * 3;
        }

        let tmp_y = y;

        if (!!this.show_293b) {
            const text = "T.V.A. non applicable, article 293 B du CGI";

            invoice.setFont("RobotoRegular");
            invoice.setTextColor("#102A43");
            invoice.setFontSize(font_sizes.normal);

            tmp_y += invoice.getTextDimensions(text).h;
            invoice.text(text, x, tmp_y);

            tmp_y += margin;

            if (!products) {
                y = tmp_y;
            }
        }

        if (!!this.payment_method) {
            const text = "Méthode de paiement";

            invoice.setFont("RobotoRegular");
            invoice.setTextColor("#829AB1");
            invoice.setFontSize(font_sizes.title);

            tmp_y += invoice.getTextDimensions(text).h;
            invoice.text(text, x, tmp_y);

            tmp_y +=
                invoice.getTextDimensions(this.payment_method).h + margin / 2;
            invoice.setTextColor("#102A43");
            invoice.setFontSize(font_sizes.normal);
            invoice.text(this.payment_method, x, tmp_y);

            tmp_y += margin * 1.5;

            if (!products) {
                y = tmp_y;
            }
        }

        if (!!this.payment_deadline) {
            const text = "Date limite de règlement";

            invoice.setFont("RobotoRegular");
            invoice.setTextColor("#829AB1");
            invoice.setFontSize(font_sizes.title);

            tmp_y += invoice.getTextDimensions(text).h;
            invoice.text(text, x, tmp_y);

            tmp_y +=
                invoice.getTextDimensions(this.payment_deadline).h + margin / 2;
            invoice.setTextColor("#102A43");
            invoice.setFontSize(font_sizes.normal);
            invoice.text(this.payment_deadline, x, tmp_y);

            tmp_y += margin * 1.5;

            if (!products) {
                y = tmp_y;
            }
        }

        if (products) {
            const body: any[] = [];

            if (!!this.sub_total) {
                body.push({
                    name: "Sous total",
                    value: `${this.sub_total.toFixed(2)} ${this.currency}`,
                });
            }

            if (!!this.global_discount) {
                body.push({
                    name: "Réduction global",
                    value: `${this.global_discount.toFixed(2)} ${
                        this.currency
                    }`,
                });
            }

            Object.values(this.taxes).forEach((taxe) => {
                if (!!taxe.value) {
                    body.push({
                        name: taxe.name,
                        value: `${taxe.value.toFixed(2)} %`,
                    });
                }
            });

            if (!!this.shipping_cost) {
                body.push({
                    name: "Frais de port",
                    value: `${this.shipping_cost.toFixed(2)} ${this.currency}`,
                });
            }

            if (!!this.total) {
                body.push({
                    name: "Total",
                    value: `${this.total.toFixed(2)} ${this.currency}`,
                });
            }

            if (!!this.advance) {
                body.push({
                    name: "Accompte",
                    value: `${this.advance.toFixed(2)} ${this.currency}`,
                });
            }

            if (!!this.advance) {
                body.push({
                    name: "Net à payer",
                    value: `${this.net_to_pay.toFixed(2)} ${this.currency}`,
                });
            }

            // @ts-ignore
            invoice.autoTable({
                theme: "grid",
                startY: y,
                margin: {
                    right: margin * 4,
                    left: invoice.internal.pageSize.width / 2 + margin * 4,
                },
                showHead: false,
                body,
                columns: [
                    { header: "Name", dataKey: "name" },
                    { header: "Value", dataKey: "value" },
                ],
                columnStyles: {
                    name: {
                        fillColor: "#65D6AD",
                        textColor: "#014D40",
                        fontStyle: "bold",
                    },
                    value: {
                        halign: "right",
                    },
                },
            });

            // @ts-ignore
            const finalY = invoice.lastAutoTable.finalY;
            y = finalY > tmp_y ? finalY : tmp_y;
        }

        if (!!this.late_fees) {
            const text = this.late_fees;

            y += margin * 2;
            invoice.text(text, invoice.internal.pageSize.width / 2, y, {
                maxWidth: invoice.internal.pageSize.width - margin * 4 * 2,
                lineHeightFactor: 1.5,
                align: "center",
            });

            y += invoice.getTextDimensions(text).h * 1.5 + margin * 2;
        }

        if (!!this.pre_footer) {
            const text = "Commentaires";

            invoice.setFont("RobotoRegular");
            invoice.setTextColor("#829AB1");
            invoice.setFontSize(font_sizes.title);

            y += invoice.getTextDimensions(text).h;
            invoice.text(text, x, y);

            y += invoice.getTextDimensions(this.pre_footer).h + margin / 2;
            invoice.setTextColor("#102A43");
            invoice.setFontSize(font_sizes.normal);
            invoice.text(this.pre_footer, x, y);

            y += margin * 2;
        }

        /* HEADERS */
        const number_of_pages = invoice.internal.getNumberOfPages();

        x = invoice.internal.pageSize.width / 2;
        y = margin;
        const w = x - margin;
        const h = y + 15;

        invoice.setFillColor("#65D6AD");
        invoice.setFontSize(font_sizes.huge);
        invoice.setTextColor("#014D40");
        const text =
            (this.credit_invoice
                ? "Facture d'avoir "
                : "Facture "
            ).toUpperCase() + this.invoice_number;
        const text_x = x + (w - invoice.getTextWidth(text)) / 2;
        const text_y = y + h / 2 + invoice.getTextDimensions(text).h / 2 - 1;

        for (let i = 0; i < number_of_pages; ++i) {
            invoice.setPage(i);
            invoice.roundedRect(x, y, w, h, 1, 1, "F");
            invoice.text(text, text_x, text_y);
        }

        /* FOOTERS */
        y = invoice.internal.pageSize.height - margin;
        invoice.setTextColor("#102A43");
        invoice.setFontSize(font_sizes.small);
        for (let i = 0; i < number_of_pages; ++i) {
            invoice.setPage(i);

            let text = `${i + 1} / ${number_of_pages}`;
            x =
                invoice.internal.pageSize.width -
                invoice.getTextWidth(text) -
                margin;

            invoice.text(text, x, y);

            if (!!this.footer) {
                x = invoice.internal.pageSize.width / 2;
                invoice.text(this.footer, x, y, {
                    maxWidth: invoice.internal.pageSize.width - margin * 4 * 2,
                    lineHeightFactor: 1.25,
                    align: "center",
                });
            }
        }

        /* FILIGRAMME */
        if (!!this.filigramme) {
            const text = this.filigramme;

            invoice.setFont("RobotoBold");
            invoice.setTextColor("#BCCCDC");
            invoice.setFontSize(font_sizes.filigramme);

            const x =
                invoice.internal.pageSize.width / 2 +
                invoice.getTextWidth(text) / 6;
            const y =
                invoice.internal.pageSize.height / 2 +
                invoice.getTextWidth(text) / 6;

            for (let i = 0; i < number_of_pages; ++i) {
                invoice.setPage(i);

                invoice.text(text, x, y, {
                    align: "center",
                    baseline: "center",
                    angle: "45",
                    rotationDirection: "0",
                    charSpace: "1",
                });
            }
        }

        invoice.save("fac.pdf");
    }
}
</script>

<style>
.container {
    max-width: 960px !important;
}

.v-input__prepend-outer {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: 0 !important;
}
</style>
